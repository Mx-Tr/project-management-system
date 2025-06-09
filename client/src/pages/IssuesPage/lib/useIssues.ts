import type { AppDispatch, RootState } from '@/app/store';
import { fetchBoards } from '@/entities/Board/model/boardsThunks';
import {
	fetchAllTasks,
	fetchAllUsers,
} from '@/entities/Task/model/tasksThunks';
import type { Task } from '@/entities/Task/model/types';
import { notification } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getIssuesTableColumns } from '../ui/columns';
import { useTaskFilters } from './useTaskFilters';

export const useIssues = () => {
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();

	const { tasks, users, loading, error, loadingUsers, usersError } =
		useSelector((state: RootState) => state.tasks);
	const {
		boards,
		loading: loadingBoards,
		error: boardsError,
	} = useSelector((state: RootState) => state.boards);

	const { filteredTasks, handlers: filterHandlers } = useTaskFilters(tasks);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | undefined>(
		undefined
	);

	useEffect(() => {
		const tasksPromise = dispatch(fetchAllTasks());
		const usersPromise = dispatch(fetchAllUsers());
		const boardsPromise = dispatch(fetchBoards());

		return () => {
			tasksPromise.abort();
			usersPromise.abort();
			boardsPromise.abort();
		};
	}, [dispatch]);

	const handleOpenModal = (task: Task) => {
		setSelectedTask(task);
		setIsModalVisible(true);
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
		setSelectedTask(undefined);
	};

	const handleGoToBoardWithTask = (boardId: number, taskId: number) => {
		if (boardId > 0) {
			navigate(`/board/${boardId}?openTask=${taskId}`);
		} else {
			notification.error({
				message: 'Переход невозможен',
				description: 'Задача не привязана к какой-либо доске.',
			});
		}
	};

	const handleRowClick = (
		event: React.MouseEvent<HTMLElement>,
		record: Task
	) => {
		if ((event.target as Element).closest('.actions-column')) {
			return;
		}
		handleOpenModal(record);
	};

	const columns = getIssuesTableColumns({
		onOpenTaskModal: handleOpenModal,
		onGoToBoard: handleGoToBoardWithTask,
	});

	return {
		state: {
			loading: loading || loadingUsers || loadingBoards,
			errors: [error, usersError, boardsError].filter(
				Boolean
			) as string[],
			tasks: filteredTasks,
			boards,
			users,
			isModalVisible,
			selectedTask,
			columns,
		},
		handlers: {
			filterHandlers,
			handleCloseModal,
			handleRowClick,
		},
	};
};
