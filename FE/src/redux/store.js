import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './Reducer/userSlice';
import listingReducer from './Reducer/listingSlice';
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';

const usersConfig = {
  key: 'user-booking',
  storage,
  whitelist: ['user', 'userInfo'],
};

const userPersist = persistReducer(usersConfig, userReducer);
const rootReducer = combineReducers({
  user: userPersist,
  listing: listingReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
