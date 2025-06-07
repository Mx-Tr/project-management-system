import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AppLayout from './components/Layout/AppLayout';
import BoardPage from './features/boards/pages/BoardPage';
import BoardsPage from './features/boards/pages/BoardsPage';
import IssuesPage from './features/tasks/IssuesPage';

function App() {
	return (
		<Router>
			<AppLayout>
				<Routes>
					<Route path="/boards" element={<BoardsPage />} />
					<Route path="/board/:id" element={<BoardPage />} />
					<Route path="/issues" element={<IssuesPage />} />
					
					<Route path="/" element={<IssuesPage />} />
				</Routes>
			</AppLayout>
		</Router>
	);
}

export default App;
