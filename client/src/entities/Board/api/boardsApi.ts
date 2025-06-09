import type { Board } from '@/entities/Board/model/types';
import axios from 'axios';

const apiClient = axios.create({
	baseURL: 'http://localhost:8080/api/v1',
});

export const getBoards = async (signal?: AbortSignal): Promise<Board[]> => {
	try {
		// ждём объект со свойством data с массивом Board[]
		const response = await apiClient.get<{ data: Board[] }>('/boards', {
			signal,
		});
		return response.data.data;
	} catch (error) {
		if (axios.isCancel(error)) {
			console.log('Запрос на получение досок отменен');
			return [];
		}
		console.error('Ошибка при загрузке досок:', error);
		if (axios.isAxiosError(error) && error.response) {
			throw new Error(error.response.data?.message || error.message);
		}
		throw error;
	}
};
