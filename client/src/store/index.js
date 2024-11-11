import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import patientSlice from "./reducers/patientSlice";
import queueSlice from "./reducers/queueSlice";
import usersSlice from "./reducers/usersSlice";
import ticketSlice from "./reducers/ticketSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    patient: patientSlice,
    queue: queueSlice,
    users: usersSlice,
    tickets: ticketSlice,
  },
});

export default store;
