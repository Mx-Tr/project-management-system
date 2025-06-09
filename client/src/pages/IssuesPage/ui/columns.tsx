import type { TableProps } from 'antd';
import { Button } from 'antd';
import type { Assignee, Task } from '@/entities/Task/model/types';
import PriorityTag from '@/shared/ui/PriorityTag/PriorityTag';

interface ColumnCallbacks {
	onOpenTaskModal: (task: Task) => void;
	onGoToBoard: (boardId: number, taskId: number) => void;
}

/**
 * Генерирует конфигурацию колонок для таблицы задач.
 * @param callbacks - Объект с функциями обратного вызова для действий.
 * @returns Конфигурация колонок для Ant Design Table.
 */
export const getIssuesTableColumns = (
	callbacks: ColumnCallbacks
): TableProps<Task>['columns'] => [
	{
		title: 'Название',
		dataIndex: 'title',
		key: 'title',
		width: '30%',
		render: (text: string, record: Task) => (
			// eslint-disable-next-line jsx-a11y/anchor-is-valid
			<a onClick={() => callbacks.onOpenTaskModal(record)}>{text}</a>
		),
	},
	{
		title: 'Статус',
		dataIndex: 'status',
		key: 'status',
		width: '15%',
	},
	{
		title: 'Приоритет',
		dataIndex: 'priority',
		key: 'priority',
		width: '15%',
		render: (priority: Task['priority']) => (
			<PriorityTag priority={priority} />
		),
	},
	{
		title: 'Исполнитель',
		dataIndex: 'assignee',
		key: 'assignee',
		width: '15%',
		render: (assignee: Assignee | undefined) =>
			assignee?.fullName || 'Не назначен',
	},
	{
		title: 'Доска',
		dataIndex: 'boardName',
		key: 'boardName',
		width: '15%',
	},
	{
		title: 'Действия',
		key: 'actions',
		width: '10%',
		className: 'actions-column',
		render: (_, record: Task) => (
			<Button
				type="link"
				onClick={(e) => {
					e.stopPropagation(); // Предотвращаем срабатывание onClick на строке
					if (record.boardId) {
						callbacks.onGoToBoard(record.boardId, record.id);
					}
				}}
				disabled={!record.boardId}
				style={{ padding: 0 }}
			>
				Перейти на доску
			</Button>
		),
	},
];
