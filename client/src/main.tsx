import 'antd/dist/reset.css';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import './index.css';
import { store } from './store/store';
import { StyleProvider } from '@ant-design/cssinjs';

createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<StyleProvider hashPriority="high">
			<App />
		</StyleProvider>
	</Provider>
);
