export interface TaskFilters {
	status?: 'Backlog' | 'InProgress' | 'Done';
	boardId?: number;
	assigneeId?: number;
	searchQuery?: string;
}
