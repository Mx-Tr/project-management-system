import { DragDropContext } from '@hello-pangea/dnd';
import { Alert, Row, Spin, Typography } from 'antd';
import React from 'react';

import TaskFormModal from '@/widgets/TaskForm/TaskFormModal';
import { useBoardPage } from './lib/useBoard';
import { KanbanColumn } from './ui/KanbanColumn';

const { Title, Text } = Typography;

const KANBAN_COLUMNS = [
	{ id: 'Backlog', title: 'To do' },
	{ id: 'InProgress', title: 'In progress' },
	{ id: 'Done', title: 'Done' },
];

const BoardPage: React.FC = () => {
	const { state, handlers } = useBoardPage();

	if (state.loading) {
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

	if (state.error) {
		return (
			<Alert
				message="Ошибка загрузки задач доски"
				description={state.error}
				type="error"
				showIcon
			/>
		);
	}

	if (!state.board) {
		return (
			<Alert
				message="Информация о доске не найдена"
				description={`Не удалось найти доску с ID: ${state.boardId}`}
				type="error"
				showIcon
			/>
		);
	}

	return (
		<div>
			<Title level={2} style={{ marginBottom: '24px' }}>
				{state.board.name}
			</Title>
			<Text type="secondary">{state.board.description}</Text>

			<DragDropContext onDragEnd={handlers.handleDragEnd}>
				<Row gutter={16} style={{ marginTop: '24px' }}>
					{KANBAN_COLUMNS.map((column) => (
						<KanbanColumn
							key={column.id}
							column={column}
							tasks={
								state.tasks[
									column.id as keyof typeof state.tasks
								] || []
							}
							onOpenTaskModal={handlers.handleOpenModal}
						/>
					))}
				</Row>
			</DragDropContext>

			<TaskFormModal
				visible={state.isModalVisible}
				onClose={handlers.handleCloseModal}
				task={state.selectedTask}
				boardId={state.boardId}
			/>
		</div>
	);
};

export default BoardPage;
