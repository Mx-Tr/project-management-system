import axios from 'axios';
import type { Board } from './types/Board';

const apiClient = axios.create({
	baseURL: 'http://localhost:8080/api/v1',
});

export const getBoards = async (): Promise<Board[]> => {
	try {
		// ждём объект со свойством data с массивом Board[]
		const response = await apiClient.get<{ data: Board[] }>('/boards');
		return response.data.data;
	} catch (error) {
		console.error('Ошибка при загрузке досок:', error);
		if (axios.isAxiosError(error) && error.response) {
			throw new Error(error.response.data?.message || error.message);
		}
		throw error;
	}
};
