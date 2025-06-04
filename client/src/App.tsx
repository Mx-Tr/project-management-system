import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

function App() {
	return (
		<Router >
			<Routes>
				<Route path="/boards" element={<BoardsPage />} />
				<Route path="/board/:id" element={<BoardPage />} />
				<Route path="/issues" element={<IssuesPage />} />
			</Routes>
		</Router>
	);
}

export default App;
