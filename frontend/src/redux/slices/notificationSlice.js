import {createSlice} from "@reduxjs/toolkit";

const initialState = {
        notifications: {
            notify: false,
            target: null,
            message: "",
            status: null
        }
    }
;

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotification: (state, action) => {
            state.notifications = action.payload;
        },
        resetNotification: (state, action) => {
            state.notifications = {
                notify: false,
                target: null,
                message: "",
                status: null
            }
        },
    },
});

export const selectNotifications = (state) => state.notification.notifications;
export const {setNotification, resetNotification} = notificationSlice.actions;

export default notificationSlice.reducer;
