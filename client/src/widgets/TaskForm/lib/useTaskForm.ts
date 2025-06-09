import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, notification } from 'antd';

import type { AppDispatch, RootState } from '@/app/store';
import {
	createNewTask,
	updateExistingTask,
} from '@/entities/Task/model/tasksThunks';
import type {
	CreateTaskRequest,
	Task,
	UpdateTaskRequest,
} from '@/entities/Task/model/types';

const DRAFT_STORAGE_KEY = 'task-form-draft';

interface UseTaskFormProps {
	task?: Task;
	visible: boolean;
	onClose: () => void;
}

export const useTaskForm = ({ task, visible, onClose }: UseTaskFormProps) => {
	const [form] = Form.useForm();
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();

	const { users, loadingUsers } = useSelector(
		(state: RootState) => state.tasks
	);
	const { boards, loading: loadingBoards } = useSelector(
		(state: RootState) => state.boards
	);

	const isEditMode = !!task;

	useEffect(() => {
		if (visible) {
			if (isEditMode && task) {
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
				const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
				if (savedDraft) {
					try {
						const draftData = JSON.parse(savedDraft);
						form.setFieldsValue(draftData);
					} catch (e) {
						console.error('Ошибка разбора черновика:', e);
						localStorage.removeItem(DRAFT_STORAGE_KEY);
					}
				}
			}
		}
	}, [visible, isEditMode, task, form]);

	// Обработчик сохранения формы
	const handleFinish = async (values: any) => {
		try {
			if (isEditMode && task) {
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
				localStorage.removeItem(DRAFT_STORAGE_KEY);
			}
			onClose();
		} catch (err: any) {
			notification.error({
				message: 'Произошла ошибка',
				description: err.message,
			});
		}
	};

	// Обработчик для сохранения черновика
	const handleValuesChange = (_: any, allValues: any) => {
		if (!isEditMode) {
			localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(allValues));
		}
	};

	// Обработчик перехода на доску
	const handleGoToBoard = () => {
		if (task?.boardId) {
			onClose();
			navigate(`/board/${task.boardId}`);
		}
	};

	return {
		form,
		state: {
			isEditMode,
			users,
			boards,
			loadingUsers,
			loadingBoards,
			canRenderForm: visible && boards.length > 0 && users.length > 0,
		},
		handlers: {
			handleFinish,
			handleValuesChange,
			handleGoToBoard,
		},
	};
};
