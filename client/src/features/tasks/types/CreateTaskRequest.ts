export interface CreateTaskRequest {
	title: string;
	description: string;
	priority: 'Low' | 'Medium' | 'High';
	status: 'Backlog' | 'InProgress' | 'Done';
	assigneeId: number;
	boardId: number;
}
