import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getBoards } from '../api/boards';

export const fetchBoards = createAsyncThunk('boards/fetchBoards', async () => {
  const response = await getBoards();
  return response;
});

const boardsSlice = createSlice({
  name: 'boards',
  initialState: {
    boards: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default boardsSlice.reducer;
