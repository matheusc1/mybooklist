import { useRouter } from '@tanstack/react-router'
import { describe, expect, it, vi } from 'vitest'
import { CurrentBookEmptyState } from '#/components/dashboard/current-book-card'
import { renderWithRouter, screen } from './test-utils'

const getMe = vi.hoisted(() => vi.fn())

vi.mock('#/http/auth', () => ({
	getMe,
}))

function RouterProbe() {
	const router = useRouter()

	return (
		<div>
			<span data-testid="pathname">{router.state.location.pathname}</span>
			<span data-testid="has-query-client">
				{router.options.context?.queryClient ? 'yes' : 'no'}
			</span>
		</div>
	)
}

describe('renderWithRouter', () => {
	it('uses the production router context shape with memory history', () => {
		const { router } = renderWithRouter(<RouterProbe />, {
			initialEntries: ['/home'],
		})

		expect(router.options.context).toEqual(
			expect.objectContaining({
				queryClient: expect.anything(),
			}),
		)
		expect(screen.getByTestId('pathname')).toHaveTextContent('/home')
		expect(screen.getByTestId('has-query-client')).toHaveTextContent('yes')
	})

	it('does not run the authenticated beforeLoad guard for isolated components', () => {
		renderWithRouter(<CurrentBookEmptyState />, { initialEntries: ['/home'] })

		expect(
			screen.getByRole('link', { name: 'Start tracking' }),
		).toBeInTheDocument()
		expect(getMe).not.toHaveBeenCalled()
	})
})
