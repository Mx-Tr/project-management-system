import type { Board } from '../features/boards/types/Board';
import type { Task } from '../features/tasks/types/Task';

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
