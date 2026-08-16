import { createSlice } from "@reduxjs/toolkit";
import appApi from "../services/appApi";

const initialState = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearSession(state) {
      delete state.user;
      delete state.token;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      appApi.endpoints.signupUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.token;
      }
    );
    builder.addMatcher(
      appApi.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.token;
      }
    );

    builder.addMatcher(appApi.endpoints.logoutUser.matchFulfilled, (state) => {
      delete state.user;
      delete state.token;
    });
    builder.addMatcher(appApi.endpoints.logoutUser.matchRejected, (state) => {
      delete state.user;
      delete state.token;
    });
  },
});

export const { clearSession } = userSlice.actions;
export default userSlice.reducer;