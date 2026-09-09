import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '#/test/test-utils'
import { DeleteModal } from './delete-modal'

function renderDeleteModal(
	props: Partial<React.ComponentProps<typeof DeleteModal>> = {},
) {
	return render(
		<DeleteModal
			open
			type="session"
			bookTitle="The Hobbit"
			onOpenChange={vi.fn()}
			onConfirm={vi.fn()}
			{...props}
		/>,
	)
}

describe('DeleteModal', () => {
	it('renders session-specific copy and the reset option for the last session', () => {
		renderDeleteModal({ isLastSession: true })

		expect(screen.getByRole('dialog')).toHaveAccessibleName('The Hobbit')
		expect(screen.getByText('Delete session')).toBeInTheDocument()
		expect(
			screen.getByText(/reset this book's progress back to/i),
		).toBeInTheDocument()
		expect(screen.getByRole('checkbox')).toBeInTheDocument()
	})

	it('passes the selected reset option to confirmation', async () => {
		const user = userEvent.setup()
		const onConfirm = vi.fn()
		renderDeleteModal({ isLastSession: true, onConfirm })

		await user.click(screen.getByRole('checkbox'))
		await user.click(screen.getByRole('button', { name: 'Delete' }))

		expect(onConfirm).toHaveBeenCalledWith(true)
	})

	it('shows the warning when last-session status is unknown', () => {
		renderDeleteModal()

		expect(screen.getByText(/couldn't confirm that yet/i)).toBeInTheDocument()
		expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
	})

	it('does not show the reset controls for book deletion', () => {
		renderDeleteModal({ type: 'book' })

		expect(screen.getByText('Delete book')).toBeInTheDocument()
		expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
		expect(
			screen.queryByText(/couldn't confirm that yet/i),
		).not.toBeInTheDocument()
	})

	it('closes and resets the checkbox when cancelled', async () => {
		const user = userEvent.setup()
		const onOpenChange = vi.fn()
		const { rerender } = renderDeleteModal({
			isLastSession: true,
			onOpenChange,
		})

		await user.click(screen.getByRole('checkbox'))
		await user.click(screen.getByRole('button', { name: 'Cancel' }))

		expect(onOpenChange).toHaveBeenCalledWith(false)

		rerender(
			<DeleteModal
				open
				type="session"
				bookTitle="The Hobbit"
				isLastSession
				onOpenChange={onOpenChange}
				onConfirm={vi.fn()}
			/>,
		)

		expect(screen.getByRole('checkbox')).not.toBeChecked()
	})

	it('disables destructive actions while pending', () => {
		renderDeleteModal({ isLastSession: true, pending: true })

		expect(screen.getByRole('checkbox')).toBeDisabled()
		expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
		expect(screen.getByRole('button', { name: 'Deleting...' })).toBeDisabled()
	})
})
