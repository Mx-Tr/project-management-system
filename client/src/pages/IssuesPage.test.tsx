// src/pages/IssuesPage.test.tsx

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

// Импорты компонентов и типов
import type { RootState } from '@/app/store';
import type { Board } from '@/entities/Board/model/types';
import type { Task } from '@/entities/Task/model/types';
import type { User } from '@/shared/types/User';
import { renderWithProviders } from '@/shared/lib/test-utils';
import IssuesPage from './IssuesPage';

// ✅ МОКИРУЕМ API, А НЕ THUNKS
import * as boardApi from '@/entities/Board/api/boardsApi';
import * as taskApi from '@/entities/Task/api/taskApi';

vi.mock('@/entities/Board/api/boardsApi');
vi.mock('@/entities/Task/api/taskApi');

const mockedBoardApi = vi.mocked(boardApi);
const mockedTaskApi = vi.mocked(taskApi);


describe('IssuesPage', () => {
    // Определяем тестовые данные один раз
	const testTasks: Task[] = [
        {
			id: 1, title: 'Разработать компонент авторизации', description: '',
			priority: 'High', status: 'Backlog',
			assignee: { id: 101, fullName: 'Иван Петров', email: '', avatarUrl: '' },
			boardId: 1, boardName: 'Frontend',
		},
		{
			id: 2, title: 'Настроить API для профиля пользователя', description: '',
			priority: 'Medium', status: 'InProgress',
			assignee: { id: 102, fullName: 'Анна Сидорова', email: '', avatarUrl: '' },
			boardId: 2, boardName: 'Backend',
		},
	];
	const testUsers: User[] = [ { id: 101, fullName: 'Иван Петров' } as User ];
	const testBoards: Board[] = [ { id: 1, name: 'Frontend' } as Board ];

	const preloadedState: Partial<RootState> = {
		tasks: { tasks: testTasks, users: testUsers, loading: false, loadingUsers: false, error: null, usersError: null, currentBoardTasks: { Backlog: [], InProgress: [], Done: [] }, currentBoardError: null, contextBoardId: null, loadingCurrentBoard: false },
		boards: { boards: testBoards, loading: false, error: null },
	};
    
	it('должен корректно отображать задачи из предварительно загруженного состояния', async () => {
        // Настраиваем моки API, чтобы они не мешали
        mockedTaskApi.getTasks.mockResolvedValue(testTasks);
        mockedTaskApi.getUsers.mockResolvedValue(testUsers);
        mockedBoardApi.getBoards.mockResolvedValue(testBoards);

		renderWithProviders(<IssuesPage />, { preloadedState });

		expect(
			await screen.findByText('Разработать компонент авторизации')
		).toBeInTheDocument();
		expect(
			await screen.findByText('Настроить API для профиля пользователя')
		).toBeInTheDocument();
	});

	it('должен корректно фильтровать задачи при вводе в поле поиска', async () => {
        mockedTaskApi.getTasks.mockResolvedValue(testTasks);
        mockedTaskApi.getUsers.mockResolvedValue(testUsers);
        mockedBoardApi.getBoards.mockResolvedValue(testBoards);

		const user = userEvent.setup();
		renderWithProviders(<IssuesPage />, { preloadedState });

		const searchInput = await screen.findByPlaceholderText(
			'Поиск по названию задачи'
		);
		await user.type(searchInput, 'авторизации');

		expect(
			await screen.findByText('Разработать компонент авторизации')
		).toBeInTheDocument();
		expect(
			screen.queryByText('Настроить API для профиля пользователя')
		).not.toBeInTheDocument();
	});
});