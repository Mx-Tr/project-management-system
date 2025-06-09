import boardsReducer from '@/entities/Board/model/boardsSlice';
import tasksReducer from '@/entities/Task/model/tasksSlice';
import { configureStore } from '@reduxjs/toolkit';

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