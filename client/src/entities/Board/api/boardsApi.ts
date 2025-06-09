import type { Board } from '@/entities/Board/model/types';
import axios from 'axios';
import { apiClient } from '@/shared/api';

export const getBoards = async (signal?: AbortSignal): Promise<Board[]> => {
	try {
		// ждём объект со свойством data с массивом Board[]
		const response = await apiClient.get<{ data: Board[] }>('/boards', {
			signal,
		});
		return response.data.data;
	} catch (error) {
		if (axios.isCancel(error)) {
			return [];
		}
		if (axios.isAxiosError(error) && error.response) {
			throw new Error(error.response.data?.message || error.message);
		}
		throw error;
	}
};
