import type { Task } from '@/entities/Task/model/types';
import { useMemo, useState } from 'react';

export const useTaskFilters = (tasks: Task[]) => {
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

	return {
		filteredTasks,
		filters: {
			searchQuery,
			selectedStatus,
			selectedBoardId,
			selectedAssigneeId,
		},
		handlers: {
			setSearchQuery,
			setSelectedStatus,
			setSelectedBoardId,
			setSelectedAssigneeId,
		},
	};
};
