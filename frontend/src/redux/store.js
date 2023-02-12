import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import notificationSlice from "./slices/notificationSlice";

export const store = configureStore({
    reducer: {
        user: userSlice,
        notification: notificationSlice
    },
});
