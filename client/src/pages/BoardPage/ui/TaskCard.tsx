import React from 'react';
import { Card, Tag } from 'antd';
import type { DraggableProvided } from '@hello-pangea/dnd';
import type { Task } from '@/entities/Task/model/types.ts';
import PriorityTag from '@/shared/ui/PriorityTag/PriorityTag.tsx';

interface TaskCardProps {
	task: Task;
	isDragging: boolean;
	provided: DraggableProvided;
	onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
	task,
	isDragging,
	provided,
	onClick,
}) => {
	return (
		<div
			ref={provided.innerRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
			style={{
				...provided.draggableProps.style,
				userSelect: 'none',
				marginBottom: '10px',
				boxShadow: isDragging ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
			}}
		>
			<Card hoverable onClick={onClick}>
				<p>{task.title}</p>
				<PriorityTag priority={task.priority} />
				<div>
					{task.assignee && (
						<Tag style={{ marginTop: '8px' }}>
							{task.assignee.fullName}
						</Tag>
					)}
				</div>
			</Card>
		</div>
	);
};
