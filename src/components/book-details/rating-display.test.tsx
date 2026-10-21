import { describe, expect, it } from 'vitest'
import { render, screen } from '#/test/test-utils'
import { RatingDisplay } from './rating-display'

describe('RatingDisplay', () => {
	it('renders the rating accessibly and fills the matching number of stars', () => {
		const { container } = render(<RatingDisplay value={3} />)

		expect(
			screen.getByRole('img', { name: 'Rating: 3 out of 5 stars' }),
		).toBeInTheDocument()
		expect(container.querySelectorAll('svg.fill-accent')).toHaveLength(3)
		expect(container.querySelectorAll('svg.fill-surface3')).toHaveLength(2)
	})

	it('treats a missing rating as zero stars', () => {
		const { container } = render(<RatingDisplay />)

		expect(
			screen.getByRole('img', { name: 'Rating: 0 out of 5 stars' }),
		).toBeInTheDocument()
		expect(container.querySelectorAll('svg.fill-accent')).toHaveLength(0)
	})
})
