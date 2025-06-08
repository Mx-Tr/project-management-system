import { Layout } from 'antd';
import React, { useState } from 'react';
import type { Task } from '../../features/tasks/types/Task';
import TaskFormModal from '../TaskForm/TaskFormModal';
import HeaderComponent from './Header';

const { Content } = Layout;

interface AppLayoutProps {
	children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);

	const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

	const handleOpenCreateModal = () => {
		setEditingTask(undefined);
		setIsModalVisible(true);
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
		setEditingTask(undefined);
	};

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<HeaderComponent onOpenCreateTaskModal={handleOpenCreateModal} />
			<Content style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
				{children}
			</Content>

			<TaskFormModal
				visible={isModalVisible}
				onClose={handleCloseModal}
				task={editingTask}
			/>
		</Layout>
	);
};

export default AppLayout;
