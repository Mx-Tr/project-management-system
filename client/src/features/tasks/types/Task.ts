export interface Task {
	id: number;
	title: string;
	description: string;
	priority: 'Low' | 'Medium' | 'High';
	status: 'Backlog' | 'InProgress' | 'Done';
	assignee: Assignee;
	boardId?: number;
	boardName: string;
}

export interface Assignee {
	id: number;
	fullName: string;
	email: string;
	avatarUrl: string;
}
