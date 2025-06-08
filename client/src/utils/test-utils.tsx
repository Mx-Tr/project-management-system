import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { JSX, PropsWithChildren, ReactElement } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import boardsReducer from '../features/boards/boardsSlice';
import tasksReducer from '../features/tasks/tasksSlice';
import type { AppStore, RootState } from '../store/store';

const rootReducer = combineReducers({
	boards: boardsReducer,
	tasks: tasksReducer,
});

type AppPreloadedState = Partial<RootState>;

export const setupStore = (preloadedState?: AppPreloadedState) => {
	return configureStore({
		reducer: rootReducer,
		preloadedState,
	});
};

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
	preloadedState?: AppPreloadedState;
	store?: AppStore;
}

export function renderWithProviders(
	ui: ReactElement,
	{
		preloadedState,
		store = setupStore(preloadedState),
		...renderOptions
	}: ExtendedRenderOptions = {}
) {
	function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
		return (
			<Provider store={store}>
				<BrowserRouter>{children}</BrowserRouter>
			</Provider>
		);
	}

	return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}