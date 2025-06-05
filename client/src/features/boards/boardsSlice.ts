// src/features/boards/boardsSlice.ts
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getBoards } from './boardsApi'; // Путь к твоей API функции
import type { Board } from './types/Board';

interface BoardsState {
	boards: Board[]; // Используем тип Board
	loading: boolean;
	error: string | null;
}

const initialState: BoardsState = {
	boards: [],
	loading: false,
	error: null,
};

// Thunk для получения досок
export const fetchBoards = createAsyncThunk<
	Board[],
	void,
	{ rejectValue: string }
>('boards/fetchBoards', async (_, { rejectWithValue }) => {
	try {
		const data = await getBoards();
		return data;
	} catch (error: any) {
		return rejectWithValue(error.message || 'Failed to fetch boards');
	}
});

const boardsSlice = createSlice({
	name: 'boards',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchBoards.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchBoards.fulfilled,
				(state, action: PayloadAction<Board[]>) => {
					state.loading = false;
					state.boards = action.payload;
				}
			)
			.addCase(fetchBoards.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? 'Unknown error';
			});
	},
});

export default boardsSlice.reducer;
