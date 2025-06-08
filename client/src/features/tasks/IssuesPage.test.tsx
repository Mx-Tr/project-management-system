import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { RootState } from '../../store/store';
import type { User } from '../../types/User';
import { renderWithProviders } from '../../utils/test-utils';
import IssuesPage from './IssuesPage';

const mockDispatchedThunk = {
	abort: vi.fn(),
};

vi.mock('../boards/boardsSlice', async (importOriginal) => {
	const original = await importOriginal<any>();
	return {
		...original,
		fetchBoards: vi.fn(() => () => mockDispatchedThunk),
	};
});

vi.mock('./tasksSlice', async (importOriginal) => {
	const original = await importOriginal<any>();
	return {
		...original,
		fetchAllTasks: vi.fn(() => () => mockDispatchedThunk),
		fetchAllUsers: vi.fn(() => () => mockDispatchedThunk),
	};
});

describe('IssuesPage', () => {
	const preloadedState: Partial<RootState> = {
		tasks: {
			tasks: [
				{
					id: 1,
					title: 'Разработать компонент авторизации',
					description: 'Создать UI и логику для формы входа',
					priority: 'High',
					status: 'Backlog',
					assignee: {
						id: 101,
						fullName: 'Иван Петров',
						email: 'i.petrov@company.com',
						avatarUrl: '',
					},
					boardId: 1,
					boardName: 'Frontend',
				},
				{
					id: 2,
					title: 'Настроить API для профиля пользователя',
					description: 'Реализовать эндпоинт GET /api/users/profile',
					priority: 'Medium',
					status: 'InProgress',
					assignee: {
						id: 102,
						fullName: 'Анна Сидорова',
						email: 'a.sidorova@company.com',
						avatarUrl: '',
					},
					boardId: 2,
					boardName: 'Backend',
				},
			],
			users: [
				{ id: 101, fullName: 'Иван Петров', tasksCount: 1 } as User,
				{ id: 102, fullName: 'Анна Сидорова', tasksCount: 1 } as User,
			],
			loading: false,
			loadingUsers: false,
			loadingCurrentBoard: false,
			error: null,
			usersError: null,
			currentBoardError: null,
			currentBoardTasks: { Backlog: [], InProgress: [], Done: [] },
			contextBoardId: null,
		},
		boards: {
			boards: [
				{
					id: 1,
					name: 'Frontend',
					description: 'Задачи по клиентской части',
					taskCount: 1,
				},
				{
					id: 2,
					name: 'Backend',
					description: 'Задачи по серверной части',
					taskCount: 1,
				},
			],
			loading: false,
			error: null,
		},
	};

	it('должен корректно отображать задачи из предварительно загруженного состояния', () => {
		renderWithProviders(<IssuesPage />, { preloadedState });

		expect(
			screen.getByText('Разработать компонент авторизации')
		).toBeInTheDocument();
		expect(
			screen.getByText('Настроить API для профиля пользователя')
		).toBeInTheDocument();
	});

	it('должен корректно фильтровать задачи при вводе в поле поиска', async () => {
		const user = userEvent.setup();
		renderWithProviders(<IssuesPage />, { preloadedState });

		const searchInput = screen.getByPlaceholderText(
			'Поиск по названию задачи'
		);
		await user.type(searchInput, 'авторизации');

		expect(
			screen.getByText('Разработать компонент авторизации')
		).toBeInTheDocument();
		expect(
			screen.queryByText('Настроить API для профиля пользователя')
		).not.toBeInTheDocument();
	});
});
