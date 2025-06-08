import { Alert, Card, Col, Row, Spin, Tag, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import TaskFormModal from '../../../components/TaskForm/TaskFormModal';
import {
	clearCurrentBoardTasks,
	fetchAllUsers,
	fetchBoardsForTasksFilter,
	fetchTasksOnBoard,
	setContextBoardId,
} from '../../../features/tasks/tasksSlice';
import type { Task } from '../../../features/tasks/types/Task';
import type { AppDispatch, RootState } from '../../../store/store';
import { fetchBoards } from '../boardsSlice';

const { Title, Text } = Typography;

const KANBAN_COLUMNS = [
	{ id: 'Backlog', title: 'To do' },
	{ id: 'InProgress', title: 'In progress' },
	{ id: 'Done', title: 'Done' },
];

const BoardPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [searchParams, setSearchParams] = useSearchParams();
	const dispatch: AppDispatch = useDispatch();

	const { currentBoardTasks, loadingCurrentBoard, currentBoardError } =
		useSelector((state: RootState) => state.tasks);
	const { boards: allBoards, loading: loadingBoards } = useSelector(
		(state: RootState) => state.boards
	);

	const board = useMemo(
		() => allBoards.find((b) => b.id === Number(id)),
		[allBoards, id]
	);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | undefined>(
		undefined
	);

	const handleOpenModal = (task?: Task) => {
		setSelectedTask(task);
		setIsModalVisible(true);
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
		setSelectedTask(undefined);
		// очиста URL от параметра при закрытии модалки
		if (searchParams.has('openTask')) {
			searchParams.delete('openTask');
			setSearchParams(searchParams);
		}
	};

	useEffect(() => {
		const boardIdNumber = Number(id);
		if (boardIdNumber) {
			dispatch(fetchTasksOnBoard(boardIdNumber));
			dispatch(setContextBoardId(boardIdNumber));
		}
		if (allBoards.length === 0) {
			dispatch(fetchBoards());
		}
		dispatch(fetchBoardsForTasksFilter());
		dispatch(fetchAllUsers());

		return () => {
			dispatch(clearCurrentBoardTasks());
			dispatch(setContextBoardId(null));
		};
	}, [id, dispatch, allBoards.length]);

	useEffect(() => {
		const taskIdToOpen = searchParams.get('openTask');

		if (
			taskIdToOpen &&
			!loadingCurrentBoard &&
			currentBoardTasks.length > 0
		) {
			const taskToOpen = currentBoardTasks.find(
				(task) => task.id === Number(taskIdToOpen)
			);
			if (taskToOpen) {
				handleOpenModal(taskToOpen);
			} else {
				searchParams.delete('openTask');
				setSearchParams(searchParams);
			}
		}
	}, [loadingCurrentBoard, currentBoardTasks, searchParams, setSearchParams]);

	const tasksByStatus = useMemo(() => {
		const groupedTasks: { [key: string]: Task[] } = {
			Backlog: [],
			InProgress: [],
			Done: [],
		};
		currentBoardTasks.forEach((task) => {
			if (groupedTasks[task.status]) {
				groupedTasks[task.status].push(task);
			}
		});
		return groupedTasks;
	}, [currentBoardTasks]);

	if (loadingCurrentBoard || (loadingBoards && allBoards.length === 0)) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100%',
				}}
			>
				<Spin size="large" />
			</div>
		);
	}

	if (currentBoardError) {
		return (
			<Alert
				message="Ошибка загрузки задач доски"
				description={currentBoardError}
				type="error"
				showIcon
			/>
		);
	}

	if (!board) {
		return (
			<Alert
				message="Информация о доске не найдена"
				description={`Не удалось найти доску с ID: ${id}`}
				type="error"
				showIcon
			/>
		);
	}

	return (
		<div>
			<Title level={2} style={{ marginBottom: '24px' }}>
				{board.name}
			</Title>
			<Text type="secondary">{board.description}</Text>

			<Row gutter={16} style={{ marginTop: '24px' }}>
				{KANBAN_COLUMNS.map((column) => (
					<Col key={column.id} xs={24} sm={12} md={8}>
						<Card
							title={column.title}
							style={{ backgroundColor: '#f7f7f7' }}
						>
							<div
								style={{
									minHeight: '300px',
								}}
							>
								{tasksByStatus[column.id] &&
									tasksByStatus[column.id].map((task) => (
										<Card
											key={task.id}
											hoverable
											style={{ marginBottom: '10px' }}
											onClick={() =>
												handleOpenModal(task)
											}
										>
											<p>{task.title}</p>
											<Text type="secondary">
												Приоритет: {task.priority}
											</Text>
											<div>
												{task.assignee && (
													<Tag
														style={{
															marginTop: '8px',
														}}
													>
														{task.assignee.fullName}
													</Tag>
												)}
											</div>
										</Card>
									))}
							</div>
						</Card>
					</Col>
				))}
			</Row>

			<TaskFormModal
				visible={isModalVisible}
				onClose={handleCloseModal}
				task={selectedTask}
				boardId={Number(id)}
			/>
		</div>
	);
};

export default BoardPage;
