import type { Task } from '@/entities/Task/model/types';
import { Tag } from 'antd';
import React from 'react';

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