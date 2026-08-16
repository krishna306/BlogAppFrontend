import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import appApi from "./services/appApi";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  blacklist: [appApi.reducerPath],
};

const reducers = combineReducers({
  user: userSlice,
  [appApi.reducerPath]: appApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/PURGE"],
      },
    }).concat(appApi.middleware),
});

export default store;
