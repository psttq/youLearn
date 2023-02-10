import {createSlice} from "@reduxjs/toolkit";

const initialState = {
        user: {
            user_id: undefined,
            login: undefined,
            token: undefined,
            expires: undefined,
        }
    }
;

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
    },
});

export const selectUser = (state) => state.user.user;
export const {setUser} = userSlice.actions;

export default userSlice.reducer;
