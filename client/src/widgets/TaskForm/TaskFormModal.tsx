import type { Task } from '@/entities/Task/model/types';
import { Button, Form, Input, Modal, Select, Spin } from 'antd';
import React from 'react';
import { useTaskForm } from './lib/useTaskForm';

const { Option } = Select;

interface TaskFormModalProps {
	visible: boolean;
	onClose: () => void;
	task?: Task; // Если передана задача это режим редактирования
	boardId?: number;
}

const TaskFormModal: React.FC<TaskFormModalProps> = (props) => {
	const { form, state, handlers } = useTaskForm(props);

	return (
		<Modal
			title={
				state.isEditMode ? 'Редактирование задачи' : 'Создание задачи'
			}
			open={props.visible}
			onCancel={props.onClose}
			footer={null}
			destroyOnHidden
		>
			{state.canRenderForm ? (
				<Form
					key={props.task ? `edit-${props.task.id}` : 'create'}
					form={form}
					layout="vertical"
					onFinish={handlers.handleFinish}
					onValuesChange={handlers.handleValuesChange}
					initialValues={{
						boardId: props.boardId,
						priority: 'Medium',
					}}
				>
					<Form.Item
						name="title"
						label="Название"
						rules={[
							{
								required: true,
								message: 'Пожалуйста, введите название!',
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="description"
						label="Описание"
						rules={[
							{
								required: true,
								message: 'Пожалуйста, введите описание!',
							},
						]}
					>
						<Input.TextArea rows={4} />
					</Form.Item>
					<Form.Item
						name="boardId"
						label="Проект (Доска)"
						rules={[
							{
								required: true,
								message: 'Пожалуйста, выберите проект!',
							},
						]}
					>
						<Select
							loading={state.loadingBoards}
							placeholder="Выберите проект"
							disabled={state.isEditMode}
						>
							{state.boards.map((b) => (
								<Option key={b.id} value={b.id}>
									{b.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name="priority"
						label="Приоритет"
						rules={[{ required: true }]}
					>
						<Select>
							<Option value="Low">Low</Option>
							<Option value="Medium">Medium</Option>
							<Option value="High">High</Option>
						</Select>
					</Form.Item>
					{state.isEditMode && (
						<Form.Item
							name="status"
							label="Статус"
							rules={[{ required: true }]}
						>
							<Select>
								<Option value="Backlog">Backlog</Option>
								<Option value="InProgress">In Progress</Option>
								<Option value="Done">Done</Option>
							</Select>
						</Form.Item>
					)}
					<Form.Item
						name="assigneeId"
						label="Исполнитель"
						rules={[
							{
								required: true,
								message: 'Пожалуйста, выберите исполнителя!',
							},
						]}
					>
						<Select
							loading={state.loadingUsers}
							placeholder="Выберите исполнителя"
						>
							{state.users.map((u) => (
								<Option key={u.id} value={u.id}>
									{u.fullName}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							{state.isEditMode ? 'Сохранить' : 'Создать'}
						</Button>
						<Button
							style={{ marginLeft: 8 }}
							onClick={props.onClose}
						>
							Отмена
						</Button>
						{state.isEditMode && props.task?.boardId && (
							<Button
								type="link"
								style={{ float: 'right' }}
								onClick={handlers.handleGoToBoard}
							>
								Перейти на доску
							</Button>
						)}
					</Form.Item>
				</Form>
			) : (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '200px',
					}}
				>
					<Spin />
				</div>
			)}
		</Modal>
	);
};

export default TaskFormModal;
