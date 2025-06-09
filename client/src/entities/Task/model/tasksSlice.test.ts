import tasksReducer, {
	clearCurrentBoardTasks,
	fetchAllTasks,
	fetchTasksOnBoard,
	optimisticallyUpdateTaskStatus,
	type TasksState,
} from '@/entities/Task/model/tasksSlice';
import type { Task } from '@/entities/Task/model/types';
import type { DropResult } from '@hello-pangea/dnd';
import { describe, expect, it } from 'vitest';

// Начальное состояние для тестов
const initialState: TasksState = {
	tasks: [],
	currentBoardTasks: { Backlog: [], InProgress: [], Done: [] },
	users: [],
	loading: false,
	loadingCurrentBoard: false,
	loadingUsers: false,
	error: null,
	usersError: null,
	currentBoardError: null,
	contextBoardId: null,
};

// Моковые данные для задач
const mockTasks: Task[] = [
	{ id: 1, title: 'Task 1', status: 'Backlog', boardName: 'Board 1' } as Task,
	{ id: 2, title: 'Task 2', status: 'InProgress', boardName: 'Board 1' } as Task,
	{ id: 3, title: 'Task 3', status: 'Done', boardName: 'Board 2' } as Task,
];

describe('tasksSlice reducers', () => {
	it('should return the initial state on unknown action', () => {
		expect(tasksReducer(undefined, { type: 'unknown' })).toEqual(initialState);
	});

	it('should handle clearCurrentBoardTasks', () => {
		const currentState: TasksState = {
			...initialState,
			currentBoardTasks: {
				Backlog: [mockTasks[0]],
				InProgress: [mockTasks[1]],
				Done: [],
			},
		};
		const state = tasksReducer(currentState, clearCurrentBoardTasks());
		expect(state.currentBoardTasks).toEqual({
			Backlog: [],
			InProgress: [],
			Done: [],
		});
	});

	describe('optimisticallyUpdateTaskStatus', () => {
		it('should move a task between columns', () => {
			const startState: TasksState = {
				...initialState,
				currentBoardTasks: {
					Backlog: [mockTasks[0]], // Task 1 is here
					InProgress: [mockTasks[1]],
					Done: [],
				},
			};

			const dropResult: DropResult = {
				draggableId: '1', // ID задачи
				source: { droppableId: 'Backlog', index: 0 },
				destination: { droppableId: 'InProgress', index: 1 },
				reason: 'DROP',
				mode: 'FLUID',
				type: 'DEFAULT',
				combine: null
			};

			const action = optimisticallyUpdateTaskStatus(dropResult);
			const state = tasksReducer(startState, action);

			// Проверяем, что задачи больше нет в Backlog
			expect(state.currentBoardTasks.Backlog).toHaveLength(0);
			// Проверяем, что задача появилась в InProgress
			expect(state.currentBoardTasks.InProgress).toHaveLength(2);
			expect(state.currentBoardTasks.InProgress[1].id).toBe(1);
			expect(state.currentBoardTasks.InProgress[1].status).toBe('InProgress');
		});
	});
});

describe('tasksSlice extraReducers', () => {
	// Тестирование fetchAllTasks
	describe('fetchAllTasks', () => {
		it('should set loading to true on pending', () => {
			const action = { type: fetchAllTasks.pending.type };
			const state = tasksReducer(initialState, action);
			expect(state.loading).toBe(true);
		});

		it('should set tasks and reset loading on fulfilled', () => {
			const action = { type: fetchAllTasks.fulfilled.type, payload: mockTasks };
			const state = tasksReducer(initialState, action);
			expect(state.loading).toBe(false);
			expect(state.tasks).toEqual(mockTasks);
		});
	});

	// Тестирование fetchTasksOnBoard
	describe('fetchTasksOnBoard', () => {
		const boardTasks = [mockTasks[0], mockTasks[1]]; // Задачи только с одной доски

		it('should set loadingCurrentBoard to true on pending', () => {
			const action = { type: fetchTasksOnBoard.pending.type };
			const state = tasksReducer(initialState, action);
			expect(state.loadingCurrentBoard).toBe(true);
		});

		it('should group tasks by status on fulfilled', () => {
			const action = {
				type: fetchTasksOnBoard.fulfilled.type,
				payload: boardTasks,
			};
			const state = tasksReducer(initialState, action);

			expect(state.loadingCurrentBoard).toBe(false);
			expect(state.currentBoardTasks.Backlog).toHaveLength(1);
			expect(state.currentBoardTasks.Backlog[0].id).toBe(1);
			expect(state.currentBoardTasks.InProgress).toHaveLength(1);
			expect(state.currentBoardTasks.InProgress[0].id).toBe(2);
			expect(state.currentBoardTasks.Done).toHaveLength(0);
		});
	});
});