import { describe, expect, it } from 'vitest'
import { render, screen } from '#/test/test-utils'
import { DashboardSkeleton } from './skeleton'

describe('DashboardSkeleton', () => {
	it('renders loading placeholders for each dashboard section', () => {
		render(<DashboardSkeleton />)

		expect(
			screen.getByRole('heading', { name: 'Bookshelf' }),
		).toBeInTheDocument()
		expect(
			screen.getByRole('heading', { name: 'Weekly Stats' }),
		).toBeInTheDocument()
		expect(
			screen.getByRole('heading', { name: 'Completed' }),
		).toBeInTheDocument()
		expect(document.querySelectorAll('.animate-pulse')).toHaveLength(14)
	})
})
