import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AppLayout from './components/Layout/AppLayout';
import BoardPage from './features/boards/pages/BoardPage';
import BoardsPage from './features/boards/pages/BoardsPage';
import TaskPage from './features/tasks/TaskPage';

function App() {
	return (
		<Router>
			<AppLayout>
				<Routes>
					<Route path="/boards" element={<BoardsPage />} />
					<Route path="/board/:id" element={<BoardPage />} />
					<Route path="/issues" element={<TaskPage />} />
					
					{/*редирект или главную страницу по умолчанию */}
					<Route path="/" element={<TaskPage />} />
				</Routes>
			</AppLayout>
		</Router>
	);
}

export default App;
