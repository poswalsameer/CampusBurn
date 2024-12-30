import { CurrentUser } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CurrentUser = {
    id: undefined,
    email: "",
    username: "",
    profilePhoto: "",
    posts: [],
    comments: [],
    createdAt: new Date(),
}

const currentUserDetailSlice = createSlice({

    name: "currentUserDetails",
    initialState,
    reducers: {
        setCurrentUserDetails(state, action: PayloadAction<CurrentUser>) {
            return action.payload;
        },
        updateEmail(state, action: PayloadAction<string>) {
            // return { ...state, email: action.payload }
            state.email = action.payload;
        },
        updateUsername(state, action: PayloadAction<string>) {
            state.username = action.payload;
        },
        updateProfilePhoto(state, action: PayloadAction<string>) {
            state.profilePhoto = action.payload;
        },
        updatePosts(state, action: PayloadAction<any[]>) {
            state.posts = action.payload;
        },
        updateComments(state, action: PayloadAction<any[]>) {
            state.comments = action.payload;
        },
        resetCurrentUser(){
            return initialState;
        }
    }

})

export const { setCurrentUserDetails, updateEmail, updateUsername, updateProfilePhoto, updatePosts, updateComments, resetCurrentUser } =
  currentUserDetailSlice.actions;

// Export the reducer
export default currentUserDetailSlice.reducer;