import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PriorityTag from './PriorityTag';

describe('PriorityTag', () => {
	it('should render a High priority tag', () => {
		render(<PriorityTag priority="High" />);
		const tagElement = screen.getByText('High');
		expect(tagElement).toBeInTheDocument();
		expect(tagElement.className).toContain('ant-tag-red');
	});

	it('should render a Medium priority tag', () => {
		render(<PriorityTag priority="Medium" />);
		const tagElement = screen.getByText('Medium');
		expect(tagElement).toBeInTheDocument();
		expect(tagElement.className).toContain('ant-tag-orange');
	});

	it('should render a Low priority tag', () => {
		render(<PriorityTag priority="Low" />);
		const tagElement = screen.getByText('Low');
		expect(tagElement).toBeInTheDocument();
		expect(tagElement.className).toContain('ant-tag-green');
	});
});
