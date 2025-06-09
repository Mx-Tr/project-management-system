import type { MenuProps } from 'antd';
import { Button, Layout, Menu } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const { Header } = Layout;

interface HeaderComponentProps {
	onOpenCreateTaskModal: () => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
	onOpenCreateTaskModal,
}) => {
	const currentPath = window.location.pathname;
	let defaultSelectedKey = '';
	if (currentPath.startsWith('/issues')) {
		defaultSelectedKey = 'issues';
	} else if (
		currentPath.startsWith('/boards') ||
		currentPath.startsWith('/board/')
	) {
		defaultSelectedKey = 'boards';
	}

	const menuItems: MenuProps['items'] = [
		{
			key: 'issues',
			label: <Link to="/issues">Все задачи</Link>,
		},
		{
			key: 'boards',
			label: <Link to="/boards">Проекты</Link>,
		},
	];

	return (
		<Header
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '0 24px',
				backgroundColor: 'white',
			}}
		>
			<Menu
				theme="light"
				mode="horizontal"
				defaultSelectedKeys={[defaultSelectedKey]}
				items={menuItems}
				style={{ flex: 1, borderBottom: 'none' }}
			/>
			<Button type="primary" onClick={onOpenCreateTaskModal}>
				Создать задачу
			</Button>
		</Header>
	);
};

export default HeaderComponent;
