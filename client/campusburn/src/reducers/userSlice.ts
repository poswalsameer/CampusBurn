import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserDetails {
  email: string;
  username: string;
  password: string;
}

const initialState: UserDetails = {
  email: "",
  username: "",
  password: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails(state, action: PayloadAction<UserDetails>) {
      return action.payload;
    },
    updateUserDetail(state, action: PayloadAction<Partial<UserDetails>>) {
      return { ...state, ...action.payload };
    },
    resetUserDetails() {
      return initialState;
    },
  },
});

export const { setUserDetails, updateUserDetail, resetUserDetails } = userSlice.actions;
export default userSlice.reducer;
