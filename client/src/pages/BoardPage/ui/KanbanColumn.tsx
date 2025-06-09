import { Card, Col } from 'antd';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import React from 'react';
import type { Task } from '@/entities/Task/model/types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
	column: {
		id: string;
		title: string;
	};
	tasks: Task[];
	onOpenTaskModal: (task: Task) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
	column,
	tasks,
	onOpenTaskModal,
}) => {
	return (
		<Droppable key={column.id} droppableId={column.id} type="TASK">
			{(provided, snapshot) => (
				<Col xs={24} sm={12} md={8}>
					<Card
						title={column.title}
						style={{
							backgroundColor: snapshot.isDraggingOver
								? '#e6f7ff'
								: '#f7f7f7',
							transition: 'background-color 0.2s ease',
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
							{tasks.map((task, index) => (
								<Draggable
									key={task.id}
									draggableId={task.id.toString()}
									index={index}
								>
									{(providedDraggable, snapshotDraggable) => (
										<TaskCard
											task={task}
											isDragging={
												snapshotDraggable.isDragging
											}
											provided={providedDraggable}
											onClick={() =>
												onOpenTaskModal(task)
											}
										/>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					</Card>
				</Col>
			)}
		</Droppable>
	);
};
