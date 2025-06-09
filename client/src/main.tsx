import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import { store } from './app/store.ts';
import './app/styles/index.css';

createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<StyleProvider hashPriority="high">
			<ConfigProvider componentSize='large'>
			<App />
			</ConfigProvider>
		</StyleProvider>
	</Provider>
);
