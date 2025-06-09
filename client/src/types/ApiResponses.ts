import type { Board } from '../entities/Board/model/types';
import type { Task } from '@/entities/Task/model/types';

// Ответ на запрос всех досок
export interface GetBoardsResponse {
	boards: Board[];
}

// Ответ на запрос всех задач
export interface GetTasksResponse {
	tasks: Task[];
}

// Ответ на запрос задач по ID доски
export interface GetTasksOnBoardResponse {
	tasks: Task[];
}

// Ответ на запрос задачи по ID
export interface GetTaskByIDResponse {
	task: Task;
}
