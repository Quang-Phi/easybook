const { createAsyncThunk, createSlice } = require('@reduxjs/toolkit');
const { default: mAxios } = require('~/services/Axios');

const initialState = {
  user: {
    user_id: '',
    token: '',
  },
  userInfo: {},
  listFavorite: [],
  status: false,
  message: {
    type: '',
    content: '',
  },
  loading: false,
  err: false,
};
const addUser = createAsyncThunk('user/create', async (data) => {
  try {
    const csrfRes = await mAxios.get('/csrf-token');
    const csrfToken = csrfRes.data.csrfToken;
    if (csrfToken) {
      const createUserRes = await mAxios.post('/user/create', data);
      return createUserRes.data;
    }
  } catch (error) {
    return {
      loading: false,
      message: {
        type: 'error',
        content: 'Something went wrong',
      },
    };
  }
});
const updateUser = createAsyncThunk('user/update', async (data) => {
  try {
    const response = await mAxios.post('/user/update', data);
    return response.data;
  } catch (err) {
    return {
      loading: true,
      message: {
        type: 'error',
        content: 'Something went wrong',
      },
    };
  }
});
const logIn = createAsyncThunk('user/login', async (data) => {
  try {
    const response = await mAxios.post('/user/login', data);
    return response.data;
  } catch (error) {
    return {
      loading: false,
      message: {
        type: 'error',
        content: 'Something went wrong',
      },
    };
  }
});
const getInfoUser = createAsyncThunk(`user/get-info`, async (id) => {
  try {
    const response = await mAxios.get(`/user/get-info/` + id);
    return response.data;
  } catch (error) {
    return {
      loading: false,
      message: {
        type: 'error',
        content: 'Something went wrong',
      },
    };
  }
});
const getFavorites = createAsyncThunk(`user/get-favorites`, async (id) => {
  try {
    const response = await mAxios.get(`/user/get-favorites/` + id);
    return response.data;
  } catch (err) {
    return {
      message: {
        type: 'error',
        content: 'Something went wrong',
      },
    };
  }
});
const addFavorites = createAsyncThunk(
  'user/add-favorites',
  async ({ id, userId }) => {
    try {
      const response = await mAxios.post('/user/add-favorites', { id, userId });
      return response.data;
    } catch (err) {
      return {
        message: {
          type: 'error',
          content: 'Something went wrong',
        },
      };
    }
  },
);
const deleteFavorites = createAsyncThunk(
  'user/delete-favorites',
  async ({ favId }) => {
    try {
      const response = await mAxios.post('/user/delete-favorites', {
        favId,
      });
      return response.data;
    } catch (err) {
      return {
        message: {
          type: 'error',
          content: 'Something went wrong',
        },
      };
    }
  },
);
const addComment = createAsyncThunk(`user/add-comment`, async (data) => {
  try {
    const response = await mAxios.post(`/user/add-comment`, data);
    return response.data;
  } catch (err) {
    return {
      message: {
        type: 'error',
        content: 'Something went wrong',
      },
    };
  }
});
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logOut: (state) => {
      state.user = {
        user_id: '',
        token: '',
      };
      state.userInfo = {};
    },
    clearSliceUser: (state) => {
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
      .addCase(logIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user,
          user_id: action.payload.user_id,
          token: action.payload.token,
        };

        state.message = {
          type: action.payload.type,
          content: action.payload.message,
        };
      })

      .addCase(getInfoUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })

      .addCase(getFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.listFavorite = action.payload;
      });

    builder
      .addMatcher(
        (action) =>
          [
            'user/get-favorites/pending',
            'user/add-favorites/pending',
            'user/delete-favorites/pending',
            'user/add-comment/pending',
          ].includes(action.type),
        (state) => {
          return {
            ...state,
            err: false,
            status: null,
          };
        },
      )
      .addMatcher(
        (action) =>
          [
            'user/create/pending',
            'user/update/pending',
            'user/login/pending',
            'user/get-info/pending',
          ].includes(action.type),
        (state) => {
          return {
            ...state,
            loading: true,
            err: false,
            status: null,
          };
        },
      )
      .addMatcher(
        (action) =>
          [
            'user/create/fulfilled',
            'user/update/fulfilled',
            'user/add-favorites/fulfilled',
            'user/delete-favorites/fulfilled',
            'user/add-comment/fulfilled',
          ].includes(action.type),
        (state, action) => {
          return {
            ...state,
            loading: false,
            message: {
              type: action.payload.type,
              content: action.payload.message,
            },
            status: action.payload.status,
          };
        },
      );
  },
});

export default userSlice.reducer;
export {
  addUser,
  updateUser,
  logIn,
  getInfoUser,
  getFavorites,
  addFavorites,
  deleteFavorites,
  addComment,
};
export const { logOut, clearSliceUser } = userSlice.actions;
