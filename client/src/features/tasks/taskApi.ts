import axios from 'axios';
import type { User } from '../../types/User';
import type { Task } from './types/Task';

import type { CreateTaskRequest } from './types/CreateTaskRequest';
import type { UpdateTaskRequest } from './types/UpdateTaskRequest';

const apiClient = axios.create({
	baseURL: 'http://localhost:8080/api/v1',
});

apiClient.interceptors.request.use((request) => {
	// console.log(
	// 	'Starting Request:',
	// 	request.method?.toUpperCase(),
	// 	request.url,
	// 	request.params ? JSON.stringify(request.params) : '',
	// 	request.data ? JSON.stringify(request.data) : ''
	// );
	return request;
});

apiClient.interceptors.response.use(
	(response) => {
		// console.log(
		// 	'Response:',
		// 	response.status,
		// 	response.config.url,
		// 	response.data
		// );
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

export const getTasks = async (): Promise<Task[]> => {
	try {
		const response = await apiClient.get<{ data: Task[] }>('/tasks');
		return response.data.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			throw new Error(
				(error.response.data as any)?.message || 'Failed to fetch tasks'
			);
		}
		throw error;
	}
};

export const getUsers = async (): Promise<User[]> => {
	try {
		const response = await apiClient.get<{ data: User[] }>('/users');
		return response.data.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			throw new Error(
				(error.response.data as any)?.message || 'Failed to fetch users'
			);
		}
		throw error;
	}
};

export const getTasksOnBoard = async (boardId: number): Promise<Task[]> => {
	try {
		// Ответ от /boards/{boardId} обернут в "data", а внутри массив задач
		const response = await apiClient.get<{ data: Task[] }>(
			`/boards/${boardId}`
		);
		return response.data.data;
	} catch (error) {
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
	taskData: CreateTaskRequest
): Promise<Task> => {
	try {
		// Ответ на POST /tasks/create содержит { id: number }, для обновления стора нужна вся задача
		const createResponse = await apiClient.post<{ data: { id: number } }>(
			'/tasks/create',
			taskData
		);
		const newTaskId = createResponse.data.data.id;
		const response = await apiClient.get<{ data: Task }>(
			`/tasks/${newTaskId}`
		);
		return response.data.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			throw new Error(
				(error.response.data as any)?.message || 'Failed to create task'
			);
		}
		throw error;
	}
};

export const updateTask = async (
	taskId: number,
	taskData: UpdateTaskRequest
): Promise<Task> => {
	try {
		// PUT /tasks/update/{taskId} возвращает только { message: "..." } так что запращиваем всю задачу
		await apiClient.put(`/tasks/update/${taskId}`, taskData);
		const response = await apiClient.get<{ data: Task }>(
			`/tasks/${taskId}`
		);
		return response.data.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			throw new Error(
				(error.response.data as any)?.message || 'Failed to update task'
			);
		}
		throw error;
	}
};

export const updateTaskStatus = async (
	taskId: number,
	status: string
): Promise<void> => {
	try {
		await apiClient.put(`/tasks/updateStatus/${taskId}`, { status });
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			throw new Error(
				(error.response.data as any)?.message ||
					'Failed to update task status'
			);
		}
		throw error;
	}
};
