import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { notification } from 'antd';
import type { DropResult } from '@hello-pangea/dnd';

import type { AppDispatch, RootState } from '@/app/store';
import { fetchBoards } from '@/entities/Board/model/boardsThunks';
import {
	clearCurrentBoardTasks,
	optimisticallyUpdateTaskStatus,
	setContextBoardId,
} from '@/entities/Task/model/tasksSlice';
import {
	fetchAllUsers,
	fetchTasksOnBoard,
	updateTaskStatus,
} from '@/entities/Task/model/tasksThunks';
import type { Task } from '@/entities/Task/model/types';

export const useBoardPage = () => {
	const { id } = useParams<{ id: string }>();
	const boardId = Number(id);

	const [searchParams, setSearchParams] = useSearchParams();
	const dispatch: AppDispatch = useDispatch();

	// ВЫБОРКА ДАННЫХ ИЗ STORE
	const { currentBoardTasks, loadingCurrentBoard, currentBoardError } =
		useSelector((state: RootState) => state.tasks);
	const { boards: allBoards, loading: loadingBoards } = useSelector(
		(state: RootState) => state.boards
	);
	const board = useMemo(
		() => allBoards.find((b) => b.id === boardId),
		[allBoards, boardId]
	);

	// ЛОКАЛЬНОЕ СОСТОЯНИE
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | undefined>(
		undefined
	);

	// ЭФФЕКТЫ

	// Загрузка данных при монтировании страницы
	useEffect(() => {
		if (boardId) {
			const tasksPromise = dispatch(fetchTasksOnBoard(boardId));
			const boardsPromise = dispatch(fetchBoards());
			const usersPromise = dispatch(fetchAllUsers());
			dispatch(setContextBoardId(boardId));

			return () => {
				tasksPromise.abort();
				boardsPromise.abort();
				usersPromise.abort();
				dispatch(clearCurrentBoardTasks());
				dispatch(setContextBoardId(null));
			};
		}
	}, [boardId, dispatch]);

	// Открытие модального окна по параметру в URL
	useEffect(() => {
		const taskIdToOpen = searchParams.get('openTask');
		if (!taskIdToOpen || loadingCurrentBoard) return;

		const allTasks = Object.values(currentBoardTasks).flat();
		if (allTasks.length === 0 && !currentBoardError) return;

		const taskToOpen = allTasks.find(
			(task) => task.id === Number(taskIdToOpen)
		);

		if (taskToOpen) {
			setSelectedTask(taskToOpen);
			setIsModalVisible(true);
		} else {
			notification.warning({
				message: 'Задача не найдена',
				description: `Задача с ID ${taskIdToOpen} не найдена на этой доске.`,
			});
			searchParams.delete('openTask');
			setSearchParams(searchParams);
		}
	}, [
		loadingCurrentBoard,
		currentBoardTasks,
		searchParams,
		setSearchParams,
		currentBoardError,
	]);

	// ОБРАБОТЧИКИ СОБЫТИЙ

	const handleOpenModal = (task: Task) => {
		setSelectedTask(task);
		setIsModalVisible(true);
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
		setSelectedTask(undefined);
		if (searchParams.has('openTask')) {
			searchParams.delete('openTask');
			setSearchParams(searchParams);
		}
	};

	const handleDragEnd = (result: DropResult) => {
		const { destination, source, draggableId } = result;
		if (
			!destination ||
			(destination.droppableId === source.droppableId &&
				destination.index === source.index)
		) {
			return;
		}

		dispatch(optimisticallyUpdateTaskStatus(result));
		dispatch(
			updateTaskStatus({
				taskId: Number(draggableId),
				status: destination.droppableId,
			})
		);
	};

	// ВОЗВРАЩАЕМЫЕ ДАННЫЕ
	return {
		state: {
			boardId,
			board,
			loading:
				loadingCurrentBoard ||
				(loadingBoards && allBoards.length === 0),
			error: currentBoardError,
			tasks: currentBoardTasks,
			isModalVisible,
			selectedTask,
		},
		handlers: {
			handleDragEnd,
			handleOpenModal,
			handleCloseModal,
		},
	};
};
