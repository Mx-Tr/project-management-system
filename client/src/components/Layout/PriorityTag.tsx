import { Tag } from 'antd';
import React from 'react';
import type { Task } from '../../features/tasks/types/Task';

interface PriorityTagProps {
	priority: Task['priority'];
}

const PRIORITY_COLORS: Record<Task['priority'], string> = {
	High: 'red',
	Medium: 'orange',
	Low: 'green',
};

const PriorityTag: React.FC<PriorityTagProps> = ({ priority }) => {
	return <Tag color={PRIORITY_COLORS[priority]}>{priority}</Tag>;
};

export default PriorityTag;