import { configureStore } from "@reduxjs/toolkit";
import userDetailsReducer from "../reducers/userSlice";
import currentUserDetailsReducer from "@/reducers/currentUserDetailSlice";

const store = configureStore({
  reducer: {
    userDetails: userDetailsReducer,
    currentUserDetails: currentUserDetailsReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
