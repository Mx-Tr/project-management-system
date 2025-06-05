import { createSlice } from '@reduxjs/toolkit';
import type { Task } from './types/Task';
// import type { PayloadAction } from '@reduxjs/toolkit';

interface TasksState {
	tasks: Task[];
	loading: boolean;
	error: string | null;
}

const initialState: TasksState = {
	tasks: [],
	loading: false,
	error: null,
};

const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {},
	// extraReducers: (builder) => {
	// }
});

// export const { setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
