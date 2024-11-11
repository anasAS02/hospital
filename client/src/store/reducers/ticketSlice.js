import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/baseUrl";

export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async (status, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tickets?status=waiting`);
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTicketStatus = createAsyncThunk(
  "tickets/updateTicketStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      console.log(id, status);
      const response = await api.put(`/tickets/${id}`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNextTicket = createAsyncThunk(
  "tickets/fetchNextTicket",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tickets/next`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getTicket = createAsyncThunk(
  "tickets/getTicket",
  async (number, { rejectWithValue }) => {
    try {
      const response = await api.post(`/tickets/`, { number });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const ticketSlice = createSlice({
  name: "tickets",
  initialState: { list: [], loading: false, error: false, nextTicket: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.tickets;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTicketStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (ticket) => ticket._id === action.payload.ticket._id
        );
        if (index >= 0) state.list[index] = action.payload.ticket;
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchNextTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNextTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.nextTicket = action.payload.ticket;
      })
      .addCase(fetchNextTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.list = [action.payload.ticket];
      })
      .addCase(getTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ticketSlice.reducer;
