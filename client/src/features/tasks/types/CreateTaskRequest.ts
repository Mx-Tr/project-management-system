export interface CreateTaskRequest {
	title: string;
	description: string;
	priority: 'Low' | 'Medium' | 'High';
	assigneeId: number;
	boardId: number;
}
