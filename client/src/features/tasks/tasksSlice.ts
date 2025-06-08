import type { DropResult } from '@hello-pangea/dnd';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { User } from '../../types/User';
import {
	createTask,
	getUsers as fetchUsersApi,
	getTasks,
	getTasksOnBoard,
	updateTask,
	updateTaskStatus as updateTaskStatusApi,
} from './taskApi';
import type { CreateTaskRequest } from './types/CreateTaskRequest';
import type { Task } from './types/Task';
import type { UpdateTaskRequest } from './types/UpdateTaskRequest';

export interface GroupedTasks {
	Backlog: Task[];
	InProgress: Task[];
	Done: Task[];
}

export interface TasksState {
	tasks: Task[];
	currentBoardTasks: GroupedTasks;
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
	currentBoardTasks: {
		Backlog: [],
		InProgress: [],
		Done: [],
	},
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
>('tasks/fetchTasksOnBoard', async (boardId, { rejectWithValue, signal }) => {
	try {
		const tasksFromApi = await getTasksOnBoard(boardId, signal);
		const enrichedTasks = tasksFromApi.map((task) => ({
			...task,
			boardId: boardId,
		}));
		return enrichedTasks;
	} catch (error: any) {
		if (axios.isCancel(error)) {
			return rejectWithValue('Request Canceled');
		}
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
>('tasks/fetchAllTasks', async (_, { rejectWithValue, signal }) => {
	try {
		const data = await getTasks(signal);
		return data;
	} catch (error: any) {
		if (axios.isCancel(error)) {
			return rejectWithValue('Request Canceled');
		}
		return rejectWithValue(error.message || 'Ошибка получения задач');
	}
});

// получение всех исполнителей
export const fetchAllUsers = createAsyncThunk<
	User[],
	void,
	{ rejectValue: string }
>('tasks/fetchAllUsers', async (_, { rejectWithValue, signal }) => {
	try {
		const data = await fetchUsersApi(signal);
		return data;
	} catch (error: any) {
		if (axios.isCancel(error)) {
			return rejectWithValue('Request Canceled');
		}
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

// обновления статуса задачи
export const updateTaskStatus = createAsyncThunk<
	Task,
	{ taskId: number; status: string },
	{ rejectValue: string }
>('tasks/updateTaskStatus', async ({ taskId, status }, { rejectWithValue }) => {
	try {
		await updateTaskStatusApi(taskId, status);
		return { taskId, status } as any;
	} catch (err: any) {
		return rejectWithValue(err.message);
	}
});

const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		clearCurrentBoardTasks: (state) => {
			state.currentBoardTasks = { Backlog: [], InProgress: [], Done: [] };
			state.currentBoardError = null;
			state.loadingCurrentBoard = false;
		},
		setContextBoardId: (state, action: PayloadAction<number | null>) => {
			state.contextBoardId = action.payload;
		},
		optimisticallyUpdateTaskStatus: (
			state,
			action: PayloadAction<DropResult>
		) => {
			const { source, destination, draggableId } = action.payload;

			if (!destination) return;

			const sourceColumn = source.droppableId as keyof GroupedTasks;
			const destinationColumn =
				destination.droppableId as keyof GroupedTasks;

			// Находим и удаляем задачу из исходной колонки
			const taskToMove = state.currentBoardTasks[sourceColumn].find(
				(t) => t.id === Number(draggableId)
			);
			if (!taskToMove) return;

			state.currentBoardTasks[sourceColumn] = state.currentBoardTasks[
				sourceColumn
			].filter((t) => t.id !== Number(draggableId));

			// Добавляем задачу в новую колонку в нужную позицию
			taskToMove.status = destinationColumn;
			state.currentBoardTasks[destinationColumn].splice(
				destination.index,
				0,
				taskToMove
			);
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
				if (action.error.name !== 'AbortError') {
					state.error =
						action.payload ?? 'Незвестная ошибка получения задач';
				}
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
				if (action.error.name !== 'AbortError') {
					state.usersError =
						action.payload ?? 'Неизвестная ошибка получения юзеров';
				}
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

					// Группируем полученный плоский массив
					state.currentBoardTasks =
						action.payload.reduce<GroupedTasks>(
							(acc, task) => {
								if (!acc[task.status]) {
									acc[task.status] = [];
								}
								acc[task.status].push(task);
								return acc;
							},
							{ Backlog: [], InProgress: [], Done: [] }
						);
				}
			)
			.addCase(fetchTasksOnBoard.rejected, (state, action) => {
				state.loadingCurrentBoard = false;
				if (action.error.name !== 'AbortError') {
					state.currentBoardError =
						action.payload ??
						'Неизвестная ошибка запроса задач для доски';
				}
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
			.addCase(
				updateExistingTask.fulfilled,
				(state, action: PayloadAction<Task>) => {
					state.loading = false;
					const updatedTask = action.payload;

					const taskIndex = state.tasks.findIndex(
						(task) => task.id === updatedTask.id
					);
					if (taskIndex !== -1) {
						state.tasks[taskIndex] = updatedTask;
					}

					Object.keys(state.currentBoardTasks).forEach((status) => {
						const key = status as keyof GroupedTasks;
						state.currentBoardTasks[key] = state.currentBoardTasks[
							key
						].filter((task) => task.id !== updatedTask.id);
					});

					const newStatusKey =
						updatedTask.status as keyof GroupedTasks;
					if (state.currentBoardTasks[newStatusKey]) {
						state.currentBoardTasks[newStatusKey].push(updatedTask);
					}
				}
			)
			.addCase(updateExistingTask.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? 'Ошибка обновления задачи';
			});
	},
});

export const {
	clearCurrentBoardTasks,
	setContextBoardId,
	optimisticallyUpdateTaskStatus,
} = tasksSlice.actions;
export default tasksSlice.reducer;
