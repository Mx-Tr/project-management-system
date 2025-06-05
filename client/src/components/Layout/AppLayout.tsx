// src/components/Layout/AppLayout.tsx
import { Layout } from 'antd';
import React, { useState } from 'react';
import HeaderComponent from './Header';
// import TaskFormModal from '../TaskForm/TaskFormModal'; // Закомментировано, добавим позже

const { Content } = Layout;

interface AppLayoutProps {
	children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
	const [_isCreateTaskModalVisible, setIsCreateTaskModalVisible] =
		useState(false);

	const handleOpenCreateTaskModal = () => {
		setIsCreateTaskModalVisible(true);
	};

	// const handleCloseCreateTaskModal = () => {
	// 	setIsCreateTaskModalVisible(false);
	// };

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<HeaderComponent
				onOpenCreateTaskModal={handleOpenCreateTaskModal}
			/>
			<Content style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
				{children}
			</Content>

			{/* <TaskFormModal
				visible={isCreateTaskModalVisible}
				onClose={handleCloseCreateTaskModal}
			/> */}
		</Layout>
	);
};

export default AppLayout;
