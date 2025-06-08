import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getBoards } from './boardsApi';
import type { Board } from './types/Board';

interface BoardsState {
	boards: Board[];
	loading: boolean;
	error: string | null;
}

const initialState: BoardsState = {
	boards: [],
	loading: false,
	error: null,
};

// получение досок
export const fetchBoards = createAsyncThunk<
	Board[],
	void,
	{ rejectValue: string }
>('boards/fetchBoards', async (_, { rejectWithValue, signal }) => {
	try {
		const data = await getBoards(signal);
		return data;
	} catch (error: any) {
		if (axios.isCancel(error)) {
			return rejectWithValue('Request Canceled');
		}
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
            // Проверяем, что это не ошибка отмены запроса
            if (action.error.name !== 'AbortError') {
                state.error = action.payload ?? 'Неизвестная ошибка';
                console.error(
                    '[boardsSlice] Ошибка загрузки досок:',
                    action.payload
                );
            }
        });
	},
});

export default boardsSlice.reducer;
