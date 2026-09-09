import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '#/test/test-utils'
import { BookStatusSelector } from './book-status-selector'

describe('BookStatusSelector', () => {
	it('renders every book status as a selectable option', () => {
		render(<BookStatusSelector />)

		expect(screen.getAllByRole('radio')).toHaveLength(5)
		expect(screen.getByRole('radio', { name: 'Reading' })).toBeInTheDocument()
		expect(
			screen.getByRole('radio', { name: 'Want to read' }),
		).toBeInTheDocument()
		expect(screen.getByRole('radio', { name: 'Paused' })).toBeInTheDocument()
		expect(screen.getByRole('radio', { name: 'Completed' })).toBeInTheDocument()
		expect(screen.getByRole('radio', { name: 'Dropped' })).toBeInTheDocument()
	})

	it('reports the selected status', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		render(<BookStatusSelector onValueChange={onValueChange} />)

		await user.click(screen.getByRole('radio', { name: 'Reading' }))

		expect(onValueChange).toHaveBeenCalledWith('reading')
	})

	it('renders the selected status in read-only mode', () => {
		render(<BookStatusSelector readOnly value="completed" />)

		expect(screen.getByText('Completed')).toBeInTheDocument()
		expect(screen.queryByRole('radio')).not.toBeInTheDocument()
	})

	it('renders nothing for an unknown read-only status', () => {
		const { container } = render(
			<BookStatusSelector readOnly value="unknown" />,
		)

		expect(container).toBeEmptyDOMElement()
	})
})
