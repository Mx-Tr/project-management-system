import type { RootState } from '@/app/store';
import type { Task } from '@/entities/Task/model/types';
import { renderWithProviders } from '@/shared/lib/test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TaskFormModal from './TaskFormModal';

import * as taskApi from '@/entities/Task/api/taskApi';
vi.mock('@/entities/Task/api/taskApi');
const mockedTaskApi = vi.mocked(taskApi);

describe('TaskFormModal', () => {
	const preloadedState: Partial<RootState> = {
		tasks: {
			users: [{ id: 101, fullName: 'Иван Петров' } as any],
			tasks: [],
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
			boards: [{ id: 1, name: 'Frontend' } as any],
			loading: false,
			error: null,
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Режим создания', () => {
		it('должен вызывать createNewTask при отправке формы', async () => {
			const user = userEvent.setup();
			const handleClose = vi.fn();

			// Создаем полноценный мок для задачи, которую вернет API
			const mockApiResponse: Task = {
				id: 100,
				title: 'Новая тестовая задача',
				description: 'Описание новой задачи',
				priority: 'Medium',
				status: 'Backlog',
				assignee: {
					id: 101,
					fullName: 'Иван Петров',
					email: '',
					avatarUrl: '',
				},
				boardId: 1,
				boardName: 'Frontend',
			};

			mockedTaskApi.createTask.mockResolvedValue(mockApiResponse);

			renderWithProviders(
				<TaskFormModal
					visible={true}
					onClose={handleClose}
					boardId={1}
				/>,
				{ preloadedState }
			);

			await user.type(
				await screen.findByLabelText(/название/i),
				'Новая тестовая задача'
			);
			await user.type(
				await screen.findByLabelText(/описание/i),
				'Описание новой задачи'
			);
			await user.click(screen.getByLabelText(/исполнитель/i));
			await user.click(await screen.findByText('Иван Петров'));

			const submitButton = screen.getByRole('button', {
				name: 'Создать',
			});
			await user.click(submitButton);

			await waitFor(() => {
				// Теперь мы проверяем, что был вызван именно API-метод
				expect(mockedTaskApi.createTask).toHaveBeenCalledTimes(1);
				expect(handleClose).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('Режим редактирования', () => {
		const mockTask: Task = {
			id: 1,
			title: 'Исправить баг с авторизацией',
			description: 'При вводе неверного пароля не показывается ошибка',
			priority: 'High',
			status: 'InProgress',
			assignee: { id: 101, fullName: 'Иван Петров' } as any,
			boardId: 1,
		} as Task;

		it('должен отображать форму редактирования с предзаполненными данными', () => {
			renderWithProviders(
				<TaskFormModal
					visible={true}
					onClose={() => {}}
					task={mockTask}
				/>,
				{ preloadedState }
			);

			expect(
				screen.getByText('Редактирование задачи')
			).toBeInTheDocument();
			expect(screen.getByLabelText(/название/i)).toHaveValue(
				'Исправить баг с авторизацией'
			);
			expect(screen.getByText('Иван Петров')).toBeInTheDocument();
		});
	});
});
