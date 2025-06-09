import type { DropResult } from '@hello-pangea/dnd';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import {
	Alert,
	Card,
	Col,
	notification,
	Row,
	Spin,
	Tag,
	Typography,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import type { AppDispatch, RootState } from '../app/store';
import { fetchBoards } from '../entities/Board/model/boardsSlice';
import {
	clearCurrentBoardTasks,
	fetchAllUsers,
	fetchTasksOnBoard,
	optimisticallyUpdateTaskStatus,
	setContextBoardId,
	updateTaskStatus,
	type GroupedTasks,
} from '../entities/Task/model/tasksSlice';
import type { Task } from '@/entities/Task/model/types';
import PriorityTag from '../shared/ui/PriorityTag/PriorityTag';
import TaskFormModal from '../widgets/TaskForm/TaskFormModal';

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
		let tasksPromise: any;

		if (boardIdNumber) {
			tasksPromise = dispatch(fetchTasksOnBoard(boardIdNumber));
			dispatch(setContextBoardId(boardIdNumber));
		}
		const boardsPromise = dispatch(fetchBoards());
		const usersPromise = dispatch(fetchAllUsers());

		return () => {
			tasksPromise?.abort();
			boardsPromise.abort();
			usersPromise.abort();
			dispatch(clearCurrentBoardTasks());
			dispatch(setContextBoardId(null));
		};
	}, [id, dispatch]);

	useEffect(() => {
		const taskIdToOpen = searchParams.get('openTask');

		if (!taskIdToOpen) {
			return;
		}

		if (loadingCurrentBoard) {
			return;
		}

		const allTasks = [
			...currentBoardTasks.Backlog,
			...currentBoardTasks.InProgress,
			...currentBoardTasks.Done,
		];

		if (allTasks.length === 0 && !currentBoardError) {
			return;
		}
		const taskToOpen = allTasks.find(
			(task) => task.id === Number(taskIdToOpen)
		);

		if (taskToOpen) {
			handleOpenModal(taskToOpen);
		} else {
			notification.warning({
				message: 'Задача не найдена',
				description: `Задача с ID ${taskIdToOpen} не найдена на этой доске`,
				placement: 'topRight',
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

	const handleDragEnd = (result: DropResult) => {
		const { destination, source, draggableId } = result;

		// Если бросили вне колонки
		if (
			!destination ||
			(destination.droppableId === source.droppableId &&
				destination.index === source.index)
		) {
			return;
		}

		// Если бросили на то же самое место
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
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

	return (
		<div>
			<Title level={2} style={{ marginBottom: '24px' }}>
				{board.name}
			</Title>
			<Text type="secondary">{board.description}</Text>

			<DragDropContext onDragEnd={handleDragEnd}>
				<Row gutter={16} style={{ marginTop: '24px' }}>
					{KANBAN_COLUMNS.map((column) => (
						<Droppable
							key={column.id}
							droppableId={column.id}
							type="TASK"
						>
							{(provided, snapshot) => (
								<Col xs={24} sm={12} md={8}>
									<Card
										title={column.title}
										style={{
											backgroundColor:
												snapshot.isDraggingOver
													? '#e6f7ff'
													: '#f7f7f7',
											transition:
												'background-color 0.2s ease',
										}}
									>
										<div
											ref={provided.innerRef}
											{...provided.droppableProps}
											style={{
												minHeight: '300px',
												padding: '8px',
											}}
										>
											{currentBoardTasks[
												column.id as keyof GroupedTasks
											].map((task, index) => (
												<Draggable
													key={task.id}
													draggableId={task.id.toString()}
													index={index}
												>
													{(provided, snapshot) => (
														<div
															ref={
																provided.innerRef
															}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															style={{
																...provided
																	.draggableProps
																	.style,
																userSelect:
																	'none',
																marginBottom:
																	'10px',
																boxShadow:
																	snapshot.isDragging
																		? '0 4px 8px rgba(0,0,0,0.1)'
																		: 'none',
															}}
														>
															<Card
																hoverable
																onClick={() =>
																	handleOpenModal(
																		task
																	)
																}
															>
																<p>
																	{task.title}
																</p>
																<PriorityTag
																	priority={
																		task.priority
																	}
																/>
																<div>
																	{task.assignee && (
																		<Tag
																			style={{
																				marginTop:
																					'8px',
																			}}
																		>
																			{
																				task
																					.assignee
																					.fullName
																			}
																		</Tag>
																	)}
																</div>
															</Card>
														</div>
													)}
												</Draggable>
											))}
											{provided.placeholder}
										</div>
									</Card>
								</Col>
							)}
						</Droppable>
					))}
				</Row>
			</DragDropContext>

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
