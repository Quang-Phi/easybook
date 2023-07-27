const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');
const { default: mAxios } = require('~/services/Axios');

const initialState = {
  listings: [],
  types: [],
  rooms: [],
  facilities: [],
  cities: [],
  categories: [],
  amenities: [],
  loading: false,
  message: '',
  status: false,
  err: false,
};
const getListing = createAsyncThunk('listings/get-all', async (search) => {
  try {
    const res = await mAxios.get('/listings', { params: search });
    return res.data;
  } catch (err) {
    return err;
  }
});

const getSubData = createAsyncThunk('listings/sub-data', async () => {
  try {
    const res = await mAxios.get('/listings/sub-data');
    return res.data;
  } catch (err) {
    return err;
  }
});

const addEditHotel = createAsyncThunk(
  'listings/add-edit-hotel',
  async (data) => {
    try {
      const res = await mAxios.post('/listings/add-edit-hotel', data);
      return res.data;
    } catch (err) {
      return err;
    }
  },
);

const deleteHotel = createAsyncThunk('listings/delete-hotel', async (id) => {
  try {
    const res = await mAxios.get(`/listings/delete-hotel/` + id);
    return res.data;
  } catch (err) {
    return err;
  }
});

const getHotel = createAsyncThunk('listings/hotel-id', async (hotelId) => {
  try {
    const res = await mAxios.get(`/listings/get-hotel/${hotelId}`);
    return res.data;
  } catch (err) {
    return err;
  }
});

const getAvailableRooms = createAsyncThunk(
  'listings/hotel-id/available-rooms',
  async ({ hotelId, dateIn, dateOut }) => {
    try {
      const res = await mAxios.get(`/listings/${hotelId}/available-rooms`, {
        params: { dateIn, dateOut },
      });
      return res.data;
    } catch (err) {
      return err;
    }
  },
);

const addRoom = createAsyncThunk('listings/add-room', async (data) => {
  try {
    const res = await mAxios.post('/listings/add-room', data);
    return res.data;
  } catch (err) {
    return err;
  }
});

const getUserListings = createAsyncThunk(
  'listings/user-listings',
  async (id) => {
    try {
      const res = await mAxios.get('/listings/user-listings/' + id);
      return res.data;
    } catch (err) {
      return err;
    }
  },
);

const getUserBookings = createAsyncThunk(
  'listings/user-bookings',
  async ({ userId, page, per_page }) => {
    try {
      const res = await mAxios.get('/listings/user-bookings', {
        params: { userId, page, per_page },
      });
      return res.data;
    } catch (err) {
      return err;
    }
  },
);

const changeStatus = createAsyncThunk('listings/change-status', async (id) => {
  try {
    const res = await mAxios.get('/listings/change-status/' + id);
    return res.data;
  } catch (err) {
    return err;
  }
});
//
const listingSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    clearSliceListing: (state) => {
      state.message = {
        type: '',
        content: '',
      };
      state.status = false;
      state.loading = false;
      state.err = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getListing.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload.hotels;
        state.types = action.payload.types;
        state.facilities = action.payload.facilities;
        state.cities = action.payload.cities;
        state.err = action.payload.err;
      })

      .addCase(getSubData.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.cities = action.payload.cities;
        state.types = action.payload.types;
        state.facilities = action.payload.facilities;
        state.amenities = action.payload.amenities;
        state.err = action.payload.err;
      })

      .addCase(getAvailableRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
        state.err = action.payload.err;
      });

    builder
      .addMatcher(
        (action) =>
          [
            'listings/get-all/pending',
            'listings/sub-data/pending',
            'listings/add-edit-hotel/pending',
            'listings/hotel-id/pending',
            'listings/hotel-id/available-rooms/pending',
            'listings/add-room/pending',
            'listings/change-status/pending',
            'listings/user-listings/pending',
            'listings/delete-hotel/pending',
            'listings/user-bookings/pending',
          ].includes(action.type),
        () => {
          return {
            listings: [],
            loading: true,
            message: '',
            status: false,
            err: false,
          };
        },
      )
      .addMatcher(
        (action) =>
          [
            'listings/add-edit-hotel/fulfilled',
            'listings/add-room/fulfilled',
            'listings/change-status/fulfilled',
            'listings/delete-hotel/fulfilled',
          ].includes(action.type),
        (state, action) => {
          return {
            ...state,
            loading: false,
            status: action.payload.status || false,
            message: {
              type: action.payload.type,
              content: action.payload.message,
            },
            err: action.payload.err,
          };
        },
      )
      .addMatcher(
        (action) =>
          [
            'listings/hotel-id/fulfilled',
            'listings/user-listings/fulfilled',
            'listings/user-bookings/fulfilled',
          ].includes(action.type),
        (state, action) => {
          return {
            ...state,
            loading: false,
            listings: action.payload,
            err: action.payload.err,
          };
        },
      )
      .addMatcher(
        (action) =>
          [
            'listings/get-all/rejected',
            'listings/sub-data/rejected',
            'listings/hotel-id/rejected',
            'listings/hotel-id/available-rooms/rejected',
            'listings/user-listings/rejected',
            'listings/user-bookings/rejected',
          ].includes(action.type),
        (state) => {
          return {
            ...state,
            loading: false,
            err: true,
          };
        },
      )
      .addMatcher(
        (action) =>
          [
            'listings/delete-hotel/rejected',
            'listings/add-room/rejected',
            'listings/change-status/rejected',
            'listings/add-edit-hotel/rejected',
          ].includes(action.type),
        (state) => {
          return {
            ...state,
            loading: false,
            message: {
              type: 'error',
              content: 'Something went wrong',
            },
          };
        },
      );
  },
});

export default listingSlice.reducer;
export const { clearSliceListing } = listingSlice.actions;
export {
  getListing,
  getHotel,
  getUserListings,
  getSubData,
  addEditHotel,
  deleteHotel,
  addRoom,
  changeStatus,
  getAvailableRooms,
  getUserBookings,
};
