import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getBoards as fetchBoardsApi } from '../../features/boards/boardsApi';
import type { User } from '../../types/User';
import type { Board } from '../boards/types/Board';
import { getUsers as fetchUsersApi, getTasks } from './taskApi';
import type { Task } from './types/Task';

export interface TasksState {
	tasks: Task[];
	currentBoardTasks: Task[];
	users: User[];
	boards: Board[];
	loading: boolean;
	loadingCurrentBoard: boolean;
	loadingUsers: boolean;
	loadingBoards: boolean;
	error: string | null;
	usersError: string | null;
	boardsError: string | null;
	currentBoardError: string | null;
}

const initialState: TasksState = {
	tasks: [],
	currentBoardTasks: [],
	users: [],
	boards: [],
	loading: false,
	loadingCurrentBoard: false,
	loadingUsers: false,
	loadingBoards: false,
	error: null,
	usersError: null,
	boardsError: null,
	currentBoardError: null,
};

// получение всех задач
export const fetchAllTasks = createAsyncThunk<
	Task[],
	void,
	{ rejectValue: string }
>('tasks/fetchAllTasks', async (_, { rejectWithValue }) => {
	try {
		const data = await getTasks(); // getTasks должна вернуть Task[]
		return data;
	} catch (error: any) {
		return rejectWithValue(error.message || 'Ошибка получения заданий');
	}
});

// получение всех исполнителей
export const fetchAllUsers = createAsyncThunk<
	User[],
	void,
	{ rejectValue: string }
>('tasks/fetchAllUsers', async (_, { rejectWithValue }) => {
	try {
		const data = await fetchUsersApi();
		return data;
	} catch (error: any) {
		return rejectWithValue(error.message || 'Ошибка получения юзеров');
	}
});

export const fetchBoardsForTasksFilter = createAsyncThunk<
	Board[],
	void,
	{ rejectValue: string }
>('tasks/fetchBoardsForTasksFilter', async (_, { rejectWithValue }) => {
	try {
		const data = await fetchBoardsApi();
		return data;
	} catch (error: any) {
		return rejectWithValue(
			error.message || 'Ошибка получения проектов для фильтрации заданий'
		);
	}
});

const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllTasks.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchAllTasks.fulfilled,
				(state, action: PayloadAction<Task[]>) => {
					state.loading = false;
					state.tasks = action.payload;
				}
			)
			.addCase(fetchAllTasks.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload ?? 'Незвестная ошибка получения заданий';
			})
			// fetchAllUsers
			.addCase(fetchAllUsers.pending, (state) => {
				state.loadingUsers = true;
				state.usersError = null;
			})
			.addCase(
				fetchAllUsers.fulfilled,
				(state, action: PayloadAction<User[]>) => {
					state.loadingUsers = false;
					state.users = action.payload;
				}
			)
			.addCase(fetchAllUsers.rejected, (state, action) => {
				state.loadingUsers = false;
				state.usersError =
					action.payload ?? 'Неизвестная ошибка получения юзеров';
			})
			.addCase(fetchBoardsForTasksFilter.pending, (state) => {
				state.loadingBoards = true;
				state.boardsError = null;
			})
			.addCase(
				fetchBoardsForTasksFilter.fulfilled,
				(state, action: PayloadAction<Board[]>) => {
					state.loadingBoards = false;
					state.boards = action.payload;
				}
			)
			.addCase(fetchBoardsForTasksFilter.rejected, (state, action) => {
				state.loadingBoards = false;
				state.boardsError = action.payload ?? 'Неизвестная ошибка';
			});
	},
});

export default tasksSlice.reducer;
