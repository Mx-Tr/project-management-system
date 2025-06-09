import {
	createTask,
	getUsers as fetchUsersApi,
	getTasks,
	getTasksOnBoard,
	updateTask,
	updateTaskStatus as updateTaskStatusApi,
} from '@/entities/Task/api/taskApi';
import type {
	CreateTaskRequest,
	Task,
	UpdateTaskRequest,
} from '@/entities/Task/model/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { User } from '@/shared/types/User';

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
			await dispatch(fetchAllTasks());
			await dispatch(fetchTasksOnBoard(taskData.boardId));
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
