import type { RootState } from '@/app/store';
import type { Task } from '@/features/tasks/types/Task';
import HeaderComponent from '@/widgets/AppHeader/Header';
import TaskFormModal from '@/widgets/TaskForm/TaskFormModal';
import { Layout } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const { Content } = Layout;

interface AppLayoutProps {
	children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

	const contextBoardId = useSelector((state: RootState) => state.tasks.contextBoardId);

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
				boardId={contextBoardId ?? undefined}
			/>
		</Layout>
	);
};

export default AppLayout;
