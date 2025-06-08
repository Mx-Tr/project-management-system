import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { User } from '../../types/User';
import {
	createTask,
	getUsers as fetchUsersApi,
	getTasks,
	getTasksOnBoard,
	updateTask,
} from './taskApi';
import type { CreateTaskRequest } from './types/CreateTaskRequest';
import type { Task } from './types/Task';
import type { UpdateTaskRequest } from './types/UpdateTaskRequest';

export interface TasksState {
	tasks: Task[];
	currentBoardTasks: Task[];
	users: User[];
	loading: boolean;
	loadingCurrentBoard: boolean;
	loadingUsers: boolean;
	error: string | null;
	usersError: string | null;
	currentBoardError: string | null;
	contextBoardId: number | null;
}

const initialState: TasksState = {
	tasks: [],
	currentBoardTasks: [],
	users: [],
	loading: false,
	loadingCurrentBoard: false,
	loadingUsers: false,
	error: null,
	usersError: null,
	currentBoardError: null,
	contextBoardId: null,
};

// Получение задач на конкретной доске
export const fetchTasksOnBoard = createAsyncThunk<
	Task[],
	number,
	{ rejectValue: string }
>('tasks/fetchTasksOnBoard', async (boardId, { rejectWithValue }) => {
	try {
		const tasksFromApi = await getTasksOnBoard(boardId);

		const enrichedTasks = tasksFromApi.map((task) => ({
			...task,
			boardId: boardId,
		}));

		return enrichedTasks;
	} catch (error: any) {
		return rejectWithValue(
			error.message || `Ошибка запроса заданий для доски ${boardId}`
		);
	}
});

// получение всех задач
export const fetchAllTasks = createAsyncThunk<
	Task[],
	void,
	{ rejectValue: string }
>('tasks/fetchAllTasks', async (_, { rejectWithValue }) => {
	try {
		const data = await getTasks();
		return data;
	} catch (error: any) {
		return rejectWithValue(error.message || 'Ошибка получения задач');
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

// Создание новой задачи
export const createNewTask = createAsyncThunk<
	Task,
	{ taskData: CreateTaskRequest },
	{ rejectValue: string }
>(
	'tasks/createNewTask',
	async ({ taskData }, { dispatch, rejectWithValue }) => {
		try {
			const newTask = await createTask(taskData);
			// обновление задач
			dispatch(fetchAllTasks());
			dispatch(fetchTasksOnBoard(taskData.boardId));
			return newTask;
		} catch (error: any) {
			return rejectWithValue(error.message || 'Ошибка создания задачи');
		}
	}
);

// Обновление задачи
export const updateExistingTask = createAsyncThunk<
	Task,
	{ taskId: number; taskData: UpdateTaskRequest },
	{ rejectValue: string }
>(
	'tasks/updateExistingTask',
	async ({ taskId, taskData }, { dispatch, rejectWithValue }) => {
		try {
			const updatedTask = await updateTask(taskId, taskData);
			// обновление задач
			dispatch(fetchAllTasks());
			if (updatedTask.boardId) {
				dispatch(fetchTasksOnBoard(updatedTask.boardId));
			}
			return updatedTask;
		} catch (error: any) {
			return rejectWithValue(error.message || 'Ошибка обновления задачи');
		}
	}
);

const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		clearCurrentBoardTasks: (state) => {
			state.currentBoardTasks = [];
			state.currentBoardError = null;
			state.loadingCurrentBoard = false;
		},
		setContextBoardId: (state, action: PayloadAction<number | null>) => {
			state.contextBoardId = action.payload;
		},
	},
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
					action.payload ?? 'Незвестная ошибка получения задач';
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

			// fetchTasksOnBoard
			.addCase(fetchTasksOnBoard.pending, (state) => {
				state.loadingCurrentBoard = true;
				state.currentBoardError = null;
			})
			.addCase(
				fetchTasksOnBoard.fulfilled,
				(state, action: PayloadAction<Task[]>) => {
					state.loadingCurrentBoard = false;
					state.currentBoardTasks = action.payload;
				}
			)
			.addCase(fetchTasksOnBoard.rejected, (state, action) => {
				state.loadingCurrentBoard = false;
				state.currentBoardError =
					action.payload ??
					'Неизвестная ошибка запроса задач для доски';
			})

			// createNewTask
			.addCase(createNewTask.pending, (state) => {
				state.loading = true;
			})
			.addCase(createNewTask.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(createNewTask.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? 'Ошибка создания задачи';
			})

			// updateExistingTask
			.addCase(updateExistingTask.pending, (state) => {
				state.loading = true;
			})
			.addCase(updateExistingTask.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(updateExistingTask.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? 'Ошибка обновления задачи';
			});
	},
});

export const { clearCurrentBoardTasks, setContextBoardId } = tasksSlice.actions;
export default tasksSlice.reducer;
