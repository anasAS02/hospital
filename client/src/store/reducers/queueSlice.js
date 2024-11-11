import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/baseUrl";

export const addToQueue = createAsyncThunk(
  "queue/addToQueue",
  async (patientId, { rejectWithValue }) => {
    try {
      console.log(patientId);
      const response = await api.post("/queue/add-to-queue", { patientId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getQueue = createAsyncThunk(
  "queue/getQueue",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/queue");
      console.log(response);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const queueSlice = createSlice({
  name: "queue",
  initialState: {
    queue: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getQueue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQueue.fulfilled, (state, action) => {
        state.queue = action.payload.data;
        state.loading = false;
      })
      .addCase(getQueue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToQueue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToQueue.fulfilled, (state, action) => {
        state.loading = false;
        state.queue.push(action.payload.data);
      })
      .addCase(addToQueue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }),
});
export default queueSlice.reducer;
