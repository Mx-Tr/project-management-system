import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './app/styles/App.css';
import BoardPage from './pages/BoardPage';
import BoardsPage from './pages/BoardsPage';
import IssuesPage from './pages/IssuesPage';
import AppLayout from './shared/ui/AppLayout/AppLayout';

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
