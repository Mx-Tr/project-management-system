import type { TableProps } from 'antd';
import {
	Alert,
	Button,
	Col,
	Input,
	notification,
	Row,
	Select,
	Space,
	Spin,
	Table,
	Typography,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TaskFormModal from '../../components/TaskForm/TaskFormModal';
import type { Board } from '../../features/boards/types/Board';
import {
	fetchAllTasks,
	fetchAllUsers,
} from '../../features/tasks/tasksSlice';
import type { Assignee, Task } from '../../features/tasks/types/Task';
import type { AppDispatch, RootState } from '../../store/store';
import type { User } from '../../types/User';
import { fetchBoards } from '../boards/boardsSlice';

const { Title } = Typography;
const { Option } = Select;

const IssuesPage: React.FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();
	const { tasks, users, loading, error, loadingUsers, usersError } =
		useSelector((state: RootState) => state.tasks);
	const { boards, loading: loadingBoards, error: boardsError } = useSelector(
		(state: RootState) => state.boards
	);

	const [searchQuery, setSearchQuery] = useState('');
	const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
		undefined
	);
	const [selectedBoardId, setSelectedBoardId] = useState<number | undefined>(
		undefined
	);
	const [selectedAssigneeId, setSelectedAssigneeId] = useState<
		number | undefined
	>(undefined);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | undefined>(
		undefined
	);

	useEffect(() => {
		dispatch(fetchAllTasks());
		dispatch(fetchAllUsers());
		dispatch(fetchBoards());
		// dispatch(fetchBoardsForTasksFilter());
	}, [dispatch]);

	const handleOpenModal = (task?: Task) => {
		setSelectedTask(task);
		setIsModalVisible(true);
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
		setSelectedTask(undefined);
	};

	const filteredTasks = useMemo(() => {
		return tasks.filter((task) => {
			const matchesSearchQuery = task.title
				.toLowerCase()
				.includes(searchQuery.toLowerCase());
			const matchesStatus = selectedStatus
				? task.status === selectedStatus
				: true;
			const matchesBoard = selectedBoardId
				? task.boardId === selectedBoardId
				: true;
			const matchesAssignee = selectedAssigneeId
				? task.assignee?.id === selectedAssigneeId
				: true;
			return (
				matchesSearchQuery &&
				matchesStatus &&
				matchesBoard &&
				matchesAssignee
			);
		});
	}, [
		tasks,
		searchQuery,
		selectedStatus,
		selectedBoardId,
		selectedAssigneeId,
	]);

	const handleGoToBoardWithTask = (boardId: number, taskId: number) => {
		// явная проверка, что boardId валидный
		if (boardId > 0) {
			navigate(`/board/${boardId}?openTask=${taskId}`);
		} else {
			notification.error({
				message: 'Переход невозможен',
				description: 'Задача не привязана к какой-либо доске.',
			});
		}
	};

	const columns: TableProps<Task>['columns'] = [
		{
			title: 'Название',
			dataIndex: 'title',
			key: 'title',
			render: (text: string, record: Task) => (
				<a onClick={() => handleOpenModal(record)}>{text}</a>
			),
		},
		{
			title: 'Статус',
			dataIndex: 'status',
			key: 'status',
		},
		{
			title: 'Приоритет',
			dataIndex: 'priority',
			key: 'priority',
		},
		{
			title: 'Исполнитель',
			dataIndex: 'assignee',
			key: 'assignee',
			render: (assignee: Assignee | undefined) =>
				assignee?.fullName || 'Не назначен',
		},
		{
			title: 'Доска',
			dataIndex: 'boardName',
			key: 'boardName',
		},
		{
			title: 'Действия',
			key: 'actions',
			render: (_, record: Task) => (
				<Button
					type="link"
					onClick={() =>
						record.boardId &&
						handleGoToBoardWithTask(record.boardId, record.id)
					}
					disabled={!record.boardId}
				>
					Перейти на доску
				</Button>
			),
		},
	];

	if (loading || loadingUsers || loadingBoards) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: 'calc(100vh - 150px)',
				}}
			>
				<Spin size="large" />
			</div>
		);
	}

	if (error)
		return (
			<Alert
				message="Ошибка загрузки задач"
				description={error}
				type="error"
				showIcon
			/>
		);
	if (usersError)
		return (
			<Alert
				message="Ошибка загрузки пользователей"
				description={usersError}
				type="error"
				showIcon
			/>
		);
	if (boardsError)
		return (
			<Alert
				message="Ошибка загрузки досок для фильтра"
				description={boardsError}
				type="error"
				showIcon
			/>
		);

	return (
		<div>
			<Row
				justify="space-between"
				align="middle"
				style={{ marginBottom: '24px' }}
			>
				<Col>
					<Title level={2}>Все задачи</Title>
				</Col>
				<Col>
					<Button type="primary" onClick={() => handleOpenModal()}>
						Создать задачу
					</Button>
				</Col>
			</Row>

			<Space
				direction="vertical"
				size="middle"
				style={{ width: '100%', marginBottom: '24px' }}
			>
				<Input.Search
					placeholder="Поиск по названию задачи"
					onSearch={(value) => setSearchQuery(value)}
					onChange={(e) => setSearchQuery(e.target.value)}
					style={{ width: '100%' }}
					allowClear
				/>
				<Row gutter={16} style={{ width: '100%' }}>
					<Col xs={24} sm={12} md={6}>
						<Select
							placeholder="Фильтр по статусу"
							onChange={(value) => setSelectedStatus(value)}
							style={{ width: '100%' }}
							allowClear
						>
							<Option value="Backlog">Backlog</Option>
							<Option value="InProgress">In Progress</Option>
							<Option value="Done">Done</Option>
						</Select>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Select
							placeholder="Фильтр по доске"
							loading={loadingBoards}
							onChange={(value) => setSelectedBoardId(value)}
							style={{ width: '100%' }}
							allowClear
						>
							{boards.map((board: Board) => (
								<Option key={board.id} value={board.id}>
									{board.name}
								</Option>
							))}
						</Select>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Select
							placeholder="Фильтр по исполнителю"
							loading={loadingUsers}
							onChange={(value) => setSelectedAssigneeId(value)}
							style={{ width: '100%' }}
							allowClear
							showSearch
							filterOption={(input, option) =>
								(option?.children as unknown as string)
									?.toLowerCase()
									.includes(input.toLowerCase())
							}
						>
							{users.map((user: User) => (
								<Option key={user.id} value={user.id}>
									{user.fullName}
								</Option>
							))}
						</Select>
					</Col>
				</Row>
			</Space>

			<Table
				columns={columns}
				dataSource={filteredTasks}
				rowKey="id"
				loading={loading}
			/>

			<TaskFormModal
				visible={isModalVisible}
				onClose={handleCloseModal}
				task={selectedTask}
			/>
		</div>
	);
};

export default IssuesPage;
