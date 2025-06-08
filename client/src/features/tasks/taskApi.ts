import axios from 'axios';
import type { User } from '../../types/User';
import type { Task } from './types/Task';

import type { CreateTaskRequest } from './types/CreateTaskRequest';
import type { UpdateTaskRequest } from './types/UpdateTaskRequest';

const apiClient = axios.create({
	baseURL: 'http://localhost:8080/api/v1',
});

apiClient.interceptors.request.use((request) => {
	return request;
});

apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response) {
			console.error(
				'Response Error:',
				error.response.status,
				error.response.config.url,
				error.response.data
			);
		} else if (error.request) {
			console.error(
				'Request Error (no response):',
				error.config.method?.toUpperCase(),
				error.config.url,
				error.request
			);
		} else {
			console.error('Error creating request:', error.message);
		}
		return Promise.reject(error);
	}
);

export const getTasks = async (signal?: AbortSignal): Promise<Task[]> => {
	try {
		const response = await apiClient.get<{ data: Task[] }>('/tasks', {
			signal,
		});
		return response.data.data;
	} catch (error) {
		if (axios.isCancel(error)) {
			return [];
		}
		if (axios.isAxiosError(error) && error.response) {
			throw new Error(
				(error.response.data as any)?.message || 'Failed to fetch tasks'
			);
		}
		throw error;
	}
};

export const getUsers = async (signal?: AbortSignal): Promise<User[]> => {
	try {
		const response = await apiClient.get<{ data: User[] }>('/users', {
			signal,
		});
		return response.data.data;
	} catch (error) {
		if (axios.isCancel(error)) {
			return [];
		}
		if (axios.isAxiosError(error) && error.response) {
			throw new Error(
				(error.response.data as any)?.message || 'Failed to fetch users'
			);
		}
		throw error;
	}
};

export const getTasksOnBoard = async (
	boardId: number,
	signal?: AbortSignal
): Promise<Task[]> => {
	try {
		const response = await apiClient.get<{ data: Task[] }>(
			`/boards/${boardId}`,
			{ signal }
		);
		return response.data.data;
	} catch (error) {
		if (axios.isCancel(error)) {
			return [];
		}
		if (axios.isAxiosError(error) && error.response) {
			throw new Error(
				(error.response.data as any)?.message ||
					`Ошибка запроса заданий для доски ${boardId}`
			);
		}
		throw error;
	}
};

export const createTask = async (
	taskData: CreateTaskRequest,
	signal?: AbortSignal
): Promise<Task> => {
	try {
		const createResponse = await apiClient.post<{ data: { id: number } }>(
			'/tasks/create',
			taskData,
			{ signal }
		);
		const newTaskId = createResponse.data.data.id;
		const response = await apiClient.get<{ data: Task }>(
			`/tasks/${newTaskId}`,
			{ signal }
		);
		return response.data.data;
	} catch (error) {
		if (axios.isCancel(error)) {
			throw error;
		}
		if (axios.isAxiosError(error) && error.response) {
			throw new Error(
				(error.response.data as any)?.message ||
					'Ошибка создания задачи'
			);
		}
		throw error;
	}
};

export const updateTask = async (
	taskId: number,
	taskData: UpdateTaskRequest,
	signal?: AbortSignal
): Promise<Task> => {
	try {
		await apiClient.put(`/tasks/update/${taskId}`, taskData, { signal });
		const response = await apiClient.get<{ data: Task }>(
			`/tasks/${taskId}`,
			{ signal }
		);
		return response.data.data;
	} catch (error) {
		if (axios.isCancel(error)) {
			throw error;
		}
		if (axios.isAxiosError(error) && error.response) {
			throw new Error(
				(error.response.data as any)?.message ||
					'Ошибка обновления задачи'
			);
		}
		throw error;
	}
};

export const updateTaskStatus = async (
	taskId: number,
	status: string,
	signal?: AbortSignal
): Promise<void> => {
	try {
		await apiClient.put(
			`/tasks/updateStatus/${taskId}`,
			{ status },
			{ signal }
		);
	} catch (error) {
		if (axios.isCancel(error)) {
			return;
		}
		if (axios.isAxiosError(error) && error.response) {
			throw new Error(
				(error.response.data as any)?.message ||
					'Ошибка обновления статуса задачи'
			);
		}
		throw error;
	}
};
