import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Board } from './types';
import { fetchBoards } from '@/entities/Board/model/boardsThunks.ts';

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
