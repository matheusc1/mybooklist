import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithRoute, screen } from '#/test/test-utils'

const state = vi.hoisted(() => ({ isPending: false }))
const updateMutation = vi.hoisted(() =>
	vi.fn((_input, options) => options?.onSuccess?.()),
)

vi.mock('#/hooks/use-user', () => ({
	useUpdateReadingSpeed: () => ({
		mutate: updateMutation,
		isPending: state.isPending,
	}),
}))

describe('ReadingSpeed', () => {
	it('moves through both passages and saves the measured result', async () => {
		const user = userEvent.setup()
		await renderWithRoute('/reading-speed', { authenticated: true })

		await user.click(screen.getByRole('button', { name: /Start Reading/i }))
		expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
		await user.click(screen.getByRole('button', { name: /Next page/i }))
		await user.click(screen.getByRole('button', { name: /Finish/i }))
		expect(screen.getByText("Here's your reading pace")).toBeInTheDocument()
		await user.click(
			screen.getByRole('button', { name: /Update reading pace/i }),
		)

		expect(updateMutation).toHaveBeenCalledWith(
			{ readingSpeed: 60 },
			expect.objectContaining({ onSuccess: expect.any(Function) }),
		)
	})

	it('disables saving while the update is pending', async () => {
		state.isPending = true
		await renderWithRoute('/reading-speed', { authenticated: true })

		const user = userEvent.setup()
		await user.click(screen.getByRole('button', { name: /Start Reading/i }))
		await user.click(screen.getByRole('button', { name: /Next page/i }))
		await user.click(screen.getByRole('button', { name: /Finish/i }))

		expect(screen.getByRole('button', { name: /Saving\.\.\./i })).toBeDisabled()
		state.isPending = false
	})
})
