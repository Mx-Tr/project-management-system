import boardsReducer, { fetchBoards } from '@/entities/Board/model/boardsSlice';
import type { Board } from '@/entities/Board/model/types';
import { describe, expect, it } from 'vitest';

describe('boardsSlice', () => {
	const initialState = {
		boards: [],
		loading: false,
		error: null,
	};

	it('should return the initial state', () => {
		expect(boardsReducer(undefined, { type: 'unknown' })).toEqual(
			initialState
		);
	});

	it('should handle fetchBoards.pending', () => {
		const action = { type: fetchBoards.pending.type };
		const state = boardsReducer(initialState, action);
		expect(state.loading).toBe(true);
		expect(state.error).toBeNull();
	});

	it('should handle fetchBoards.fulfilled', () => {
		const mockBoards: Board[] = [
			{ id: 1, name: 'Project A', description: 'Desc A', taskCount: 5 },
			{ id: 2, name: 'Project B', description: 'Desc B', taskCount: 3 },
		];
		const action = { type: fetchBoards.fulfilled.type, payload: mockBoards };
		const state = boardsReducer(initialState, action);
		expect(state.loading).toBe(false);
		expect(state.boards).toEqual(mockBoards);
	});

	it('should handle fetchBoards.rejected', () => {
		const errorMessage = 'Failed to fetch';
		const action = {
			type: fetchBoards.rejected.type,
			payload: errorMessage,
			error: { name: 'Error', message: errorMessage },
		};
		const state = boardsReducer(initialState, action);
		expect(state.loading).toBe(false);
		expect(state.error).toBe(errorMessage);
	});

	it('should not set an error if the request was aborted', () => {
		const errorMessage = 'Request Canceled';
		const action = {
			type: fetchBoards.rejected.type,
			payload: errorMessage,
			error: { name: 'AbortError', message: 'Aborted' },
		};
		const state = boardsReducer(initialState, action);
		expect(state.loading).toBe(false);
		expect(state.error).toBeNull(); // Ошибка не должна установиться
	});
});