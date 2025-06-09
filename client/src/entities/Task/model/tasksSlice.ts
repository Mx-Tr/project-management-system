import type { Task } from '@/entities/Task/model/types';
import type { DropResult } from '@hello-pangea/dnd';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { User } from '@/shared/types/User.ts';
import {
	createNewTask,
	fetchAllTasks,
	fetchAllUsers,
	fetchTasksOnBoard,
	updateExistingTask,
} from './tasksThunks';

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

const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		clearCurrentBoardTasks: (state) => {
			state.currentBoardTasks = { Backlog: [], InProgress: [], Done: [] };
			state.currentBoardError = null;
			state.loadingCurrentBoard = false;
		},
		// Устанавливает ID доски, в контексте которой находится пользователь
		setContextBoardId: (state, action: PayloadAction<number | null>) => {
			state.contextBoardId = action.payload;
		},
		// обновляет статус задачи в UI сразу после drag-and-drop, не дожидаясь ответа от сервера
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
