import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Board } from '@/entities/Board/model/types.ts';
import { getBoards } from '@/entities/Board/api/boardsApi.ts';
import axios from 'axios';

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
