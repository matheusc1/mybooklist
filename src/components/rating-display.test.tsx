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

	it('uses the default star size when none is given', () => {
		const { container } = render(<RatingDisplay value={3} />)

		expect(container.querySelectorAll('svg.size-5')).toHaveLength(5)
		expect(container.querySelectorAll('svg.size-3')).toHaveLength(0)
	})

	it('uses smaller stars with the small size', () => {
		const { container } = render(<RatingDisplay value={3} size="small" />)

		expect(container.querySelectorAll('svg.size-3')).toHaveLength(5)
		expect(container.querySelectorAll('svg.size-5')).toHaveLength(0)
	})
})
