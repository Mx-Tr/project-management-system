import { Alert, Button, Card, List, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../app/store';
import { fetchBoards } from '@/entities/Board/model/boardsThunks.ts';
import type { Board } from '../entities/Board/model/types';

const BoardsPage: React.FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const { boards, loading, error } = useSelector(
		(state: RootState) => state.boards
	);

	useEffect(() => {
		const promise = dispatch(fetchBoards());

		return () => {
			promise.abort();
		};
	}, [dispatch]);

	if (loading) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100%',
				}}
			>
				<Spin size="large" />
			</div>
		);
	}

	if (error) {
		return (
			<Alert
				message="Ошибка загрузки досок"
				description={error}
				type="error"
				showIcon
			/>
		);
	}

	return (
		<div>
			<List
				grid={{
					gutter: 16,
					xs: 1,
					sm: 1,
					md: 2,
					lg: 3,
					xl: 3,
					xxl: 4,
				}}
				dataSource={boards as Board[]}
				renderItem={(board: Board) => (
					<List.Item>
						<Card
							title={board.name}
							actions={[
								<Link to={`/board/${board.id}`} key="goto">
									<Button type="primary">
										Перейти к доске
									</Button>
								</Link>,
							]}
						>
							<Card.Meta
								description={
									board.description || 'Нет описания'
								}
							/>
							<p style={{ marginTop: '10px' }}>
								Задач: {board.taskCount}
							</p>
						</Card>
					</List.Item>
				)}
			/>
			{boards.length === 0 && !loading && (
				<Alert message="Доски не найдены" type="info" />
			)}
		</div>
	);
};

export default BoardsPage;
