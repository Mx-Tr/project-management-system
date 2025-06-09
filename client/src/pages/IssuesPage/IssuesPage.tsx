import { Alert, Spin, Table } from 'antd';
import React from 'react';
import TaskFormModal from '@/widgets/TaskForm/TaskFormModal';
import { useIssues } from './lib/useIssues.ts';
import { TaskFiltersBar } from './ui/TaskFiltersBar';

const IssuesPage: React.FC = () => {
	const { state, handlers } = useIssues();

	if (state.loading) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: 'calc(100vh - 150px)',
				}}
			>
				<Spin size="large" />
			</div>
		);
	}

	if (state.errors.length > 0) {
		return (
			<Alert
				message="Ошибка при загрузке данных"
				description={state.errors.join(', ')}
				type="error"
				showIcon
			/>
		);
	}

	return (
		<div>
			<TaskFiltersBar
				handlers={handlers.filterHandlers}
				boards={state.boards}
				users={state.users}
				loadingBoards={false}
				loadingUsers={false}
			/>

			<Table
				columns={state.columns}
				dataSource={state.tasks}
				rowKey="id"
				onRow={(record) => ({
					onClick: (event) => handlers.handleRowClick(event, record),
				})}
				pagination={{
					showSizeChanger: true,
					pageSizeOptions: ['10', '15', '20', '50', '100'],
				}}
			/>

			<TaskFormModal
				visible={state.isModalVisible}
				onClose={handlers.handleCloseModal}
				task={state.selectedTask}
			/>
		</div>
	);
};

export default IssuesPage;
