import axios from 'axios';
import type { User } from '../../types/User';
import type { Task } from './types/Task';

const apiClient = axios.create({
	baseURL: 'http://localhost:8080/api/v1',
});

apiClient.interceptors.request.use((request) => {
	console.log(
		'Starting Request:',
		request.method?.toUpperCase(),
		request.url,
		request.params ? JSON.stringify(request.params) : '',
		request.data ? JSON.stringify(request.data) : ''
	);
	return request;
});

apiClient.interceptors.response.use(
	(response) => {
		console.log(
			'Response:',
			response.status,
			response.config.url,
			response.data
		);
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