import { Col, Input, Row, Select, Space } from 'antd';
import type { Board } from '@/entities/Board/model/types';
import type { User } from '@/shared/types/User';
import React from 'react';

const { Option } = Select;

interface TaskFiltersBarProps {
	handlers: {
		setSearchQuery: (value: string) => void;
		setSelectedStatus: (value: string | undefined) => void;
		setSelectedBoardId: (value: number | undefined) => void;
		setSelectedAssigneeId: (value: number | undefined) => void;
	};
	boards: Board[];
	users: User[];
	loadingBoards: boolean;
	loadingUsers: boolean;
}

export const TaskFiltersBar: React.FC<TaskFiltersBarProps> = ({
	handlers,
	boards,
	users,
	loadingBoards,
	loadingUsers,
}) => {
	return (
		<Row
			justify="space-between"
			align="middle"
			style={{ marginBottom: '24px' }}
		>
			<Col>
				<Input.Search
					placeholder="Поиск по названию задачи"
					onSearch={(value) => handlers.setSearchQuery(value)}
					onChange={(e) => handlers.setSearchQuery(e.target.value)}
					style={{ width: 300 }}
					allowClear
				/>
			</Col>
			<Col>
				<Space size="middle">
					<Select
						placeholder="Фильтр по статусу"
						onChange={handlers.setSelectedStatus}
						style={{ width: 200 }}
						allowClear
					>
						<Option value="Backlog">Backlog</Option>
						<Option value="InProgress">In Progress</Option>
						<Option value="Done">Done</Option>
					</Select>
					<Select
						placeholder="Фильтр по доске"
						loading={loadingBoards}
						onChange={handlers.setSelectedBoardId}
						style={{ width: 300 }}
						allowClear
					>
						{boards.map((board: Board) => (
							<Option key={board.id} value={board.id}>
								{board.name}
							</Option>
						))}
					</Select>
					<Select
						placeholder="Фильтр по исполнителю"
						loading={loadingUsers}
						onChange={handlers.setSelectedAssigneeId}
						style={{ width: 300 }}
						allowClear
						showSearch
						filterOption={(input, option) =>
							(option?.children as unknown as string)
								?.toLowerCase()
								.includes(input.toLowerCase())
						}
					>
						{users.map((user: User) => (
							<Option key={user.id} value={user.id}>
								{user.fullName}
							</Option>
						))}
					</Select>
				</Space>
			</Col>
		</Row>
	);
};
