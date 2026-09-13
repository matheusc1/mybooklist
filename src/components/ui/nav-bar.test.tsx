import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithRouter, screen } from '#/test/test-utils'
import { NavBar } from './nav-bar'

vi.mock('#/components/user-menu', () => ({
	UserMenu: () => <button type="button">User menu</button>,
}))

describe('NavBar', () => {
	it('renders navigation links and marks the current route', () => {
		renderWithRouter(<NavBar />, { initialEntries: ['/home'] })

		expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
			'aria-current',
			'page',
		)
		expect(screen.getByRole('link', { name: 'My Books' })).toHaveAttribute(
			'href',
			'/books',
		)
		expect(screen.getByRole('link', { name: 'Activity' })).toHaveAttribute(
			'href',
			'/activity',
		)
	})

	it('navigates to a selected section', async () => {
		const user = userEvent.setup()
		const { router } = renderWithRouter(<NavBar />)

		await user.click(screen.getByRole('link', { name: 'My Books' }))

		expect(router.state.location.pathname).toBe('/books')
	})
})
