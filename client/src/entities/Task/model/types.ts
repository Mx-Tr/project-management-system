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

export interface CreateTaskRequest {
	title: string;
	description: string;
	priority: 'Low' | 'Medium' | 'High';
	assigneeId: number;
	boardId: number;
}

export interface TaskFilters {
	status?: 'Backlog' | 'InProgress' | 'Done';
	boardId?: number;
	assigneeId?: number;
	searchQuery?: string;
}


export interface UpdateTaskRequest {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Backlog' | 'InProgress' | 'Done';
  assigneeId: number;
}
