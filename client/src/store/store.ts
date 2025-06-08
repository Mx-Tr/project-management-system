import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from '../features/boards/boardsSlice';
import tasksReducer from '../features/tasks/tasksSlice';

export const store = configureStore({
	reducer: {
		boards: boardsReducer,
		tasks: tasksReducer,
	},
});

// Экспортируем тип самого стора
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;