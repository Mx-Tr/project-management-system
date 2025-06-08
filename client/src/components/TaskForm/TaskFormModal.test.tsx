import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	createNewTask
} from '../../features/tasks/tasksSlice';
import type { Task } from '../../features/tasks/types/Task';
import type { RootState } from '../../store/store';
import { renderWithProviders } from '../../utils/test-utils';
import TaskFormModal from './TaskFormModal';

vi.mock('../../features/tasks/tasksSlice', async (importOriginal) => {
	const original = await importOriginal<any>();
	return {
		...original,
		createNewTask: vi.fn(
			() => () =>
				Promise.resolve({ type: 'tasks/createNewTask/fulfilled' })
		),
		updateExistingTask: vi.fn(
			() => () =>
				Promise.resolve({ type: 'tasks/updateExistingTask/fulfilled' })
		),
	};
});

const mockedCreateNewTask = vi.mocked(createNewTask);

describe('TaskFormModal', () => {
	const preloadedState: Partial<RootState> = {
		tasks: {
			users: [
				{
					id: 101,
					fullName: 'Иван Петров',
					email: 'i.petrov@company.com',
				} as any,
			],
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
			boards: [
				{
					id: 1,
					name: 'Frontend',
					description: 'Задачи по интерфейсу',
				} as any,
			],
			loading: false,
			error: null,
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Режим создания', () => {
		it('должен корректно отображать форму создания', () => {
			renderWithProviders(
				<TaskFormModal visible={true} onClose={() => {}} boardId={1} />,
				{ preloadedState }
			);
			expect(screen.getByText('Создание задачи')).toBeInTheDocument();
		});

		it('должен вызывать createNewTask при отправке формы', async () => {
			mockedCreateNewTask.mockReturnValue({
				type: 'tasks/createNewTask/pending',
				unwrap: () => Promise.resolve(),
			} as any);

			const user = userEvent.setup();
			const handleClose = vi.fn();

			renderWithProviders(
				<TaskFormModal
					visible={true}
					onClose={handleClose}
					boardId={1}
				/>,
				{ preloadedState }
			);

			// Заполнение полей формы
			await user.type(
				screen.getByLabelText(/название/i),
				'Реализовать страницу профиля'
			);
			await user.type(
				screen.getByLabelText(/описание/i),
				'Добавить аватар, имя и список постов пользователя'
			);

			// Выбор исполнителя
			await user.click(screen.getByLabelText(/исполнитель/i));
			await user.click(await screen.findByText('Иван Петров')); // Заменено

			// Отправка формы
			const submitButton = screen.getByRole('button', {
				name: 'Создать',
			});
			await user.click(submitButton);

			// Проверки вызовов
			await waitFor(() => {
				expect(mockedCreateNewTask).toHaveBeenCalledTimes(1);
			});
			await waitFor(() => {
				expect(handleClose).toHaveBeenCalledTimes(1);
			});

			expect(mockedCreateNewTask).toHaveBeenCalledWith(
				expect.objectContaining({
					taskData: expect.objectContaining({
						title: 'Реализовать страницу профиля',
						assigneeId: 101,
						boardId: 1,
					}),
				})
			);
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
