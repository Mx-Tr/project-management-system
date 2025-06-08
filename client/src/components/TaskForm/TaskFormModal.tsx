import { Button, Form, Input, Modal, Select, notification } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	createNewTask,
	updateExistingTask,
} from '../../features/tasks/tasksSlice';
import type { CreateTaskRequest } from '../../features/tasks/types/CreateTaskRequest';
import type { Task } from '../../features/tasks/types/Task';
import type { UpdateTaskRequest } from '../../features/tasks/types/UpdateTaskRequest';
import type { AppDispatch, RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

interface TaskFormModalProps {
	visible: boolean;
	onClose: () => void;
	task?: Task; // Если передана задача это режим редактирования
	boardId?: number;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
	visible,
	onClose,
	task,
	boardId,
}) => {
	const [form] = Form.useForm();
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();

	const { users, boards, loadingUsers, loadingBoards } = useSelector(
		(state: RootState) => state.tasks
	);

	const isEditMode = !!task;

	useEffect(() => {
		if (visible) {
			if (isEditMode) {
				form.setFieldsValue({
					title: task.title,
					description: task.description,
					boardId: task.boardId,
					priority: task.priority,
					status: task.status,
					assigneeId: task.assignee?.id,
				});
			} else {
				form.resetFields();
				if (boardId) {
					form.setFieldsValue({ boardId: boardId });
				}
			}
		}
	}, [visible, task, isEditMode, boardId, form]);

	const handleFinish = async (values: any) => {
		try {
			if (isEditMode) {
				const updateData: UpdateTaskRequest = { ...values };
				await dispatch(
					updateExistingTask({
						taskId: task.id,
						taskData: updateData,
					})
				).unwrap();
				notification.success({ message: 'Задача успешно обновлена' });
			} else {
				const createData: CreateTaskRequest = {
					title: values.title,
					description: values.description,
					priority: values.priority,
					assigneeId: values.assigneeId,
					boardId: values.boardId,
				};
				await dispatch(
					createNewTask({ taskData: createData })
				).unwrap();
				notification.success({ message: 'Задача успешно создана' });
			}
			onClose();
		} catch (err: any) {
			notification.error({
				message: 'Произошла ошибка',
				description: err.message,
			});
		}
	};

	const handleGoToBoard = () => {
		if (task && task.boardId) {
			onClose();
			navigate(`/board/${task.boardId}`);
		}
	};

	return (
		<Modal
			title={isEditMode ? 'Редактирование задачи' : 'Создание задачи'}
			open={visible}
			onCancel={onClose}
			footer={null}
			destroyOnHidden
		>
			<Form
				form={form}
				layout="vertical"
				onFinish={handleFinish}
				initialValues={{ priority: 'Medium', status: 'Backlog' }}
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
						loading={loadingBoards}
						placeholder="Выберите проект"
						disabled={isEditMode}
					>
						{boards.map((b) => (
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
				<Form.Item
					name="status"
					label="Статус"
					rules={[{ required: true }]}
				>
					<Select disabled={!isEditMode}>
						<Option value="Backlog">Backlog</Option>
						<Option value="InProgress">In Progress</Option>
						<Option value="Done">Done</Option>
					</Select>
				</Form.Item>
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
						loading={loadingUsers}
						placeholder="Выберите исполнителя"
					>
						{users.map((u) => (
							<Option key={u.id} value={u.id}>
								{u.fullName}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">
						{isEditMode ? 'Сохранить' : 'Создать'}
					</Button>
					<Button style={{ marginLeft: 8 }} onClick={onClose}>
						Отмена
					</Button>
					{isEditMode && task?.boardId && (
						<Button
							type="link"
							style={{ float: 'right' }}
							onClick={handleGoToBoard}
						>
							Перейти на доску
						</Button>
					)}
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default TaskFormModal;
