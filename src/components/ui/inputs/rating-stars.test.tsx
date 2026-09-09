import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '#/test/test-utils'
import { RatingStars } from './rating-stars'

describe('RatingStars', () => {
	it('renders five accessible star buttons', () => {
		render(<RatingStars />)

		expect(screen.getAllByRole('button')).toHaveLength(5)
		expect(screen.getByRole('button', { name: '1 star' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: '5 stars' })).toBeInTheDocument()
	})

	it('updates an uncontrolled rating when a star is selected', async () => {
		const user = userEvent.setup()
		render(<RatingStars />)

		const thirdStar = screen.getByRole('button', { name: '3 stars' })
		await user.click(thirdStar)
		await user.unhover(thirdStar)

		const selectedStars = screen
			.getAllByRole('button')
			.slice(0, 3)
			.map((button) => button.querySelector('svg'))
		const unselectedStars = screen
			.getAllByRole('button')
			.slice(3)
			.map((button) => button.querySelector('svg'))

		expect(
			selectedStars.every((star) => star?.classList.contains('fill-accent')),
		).toBe(true)
		expect(
			unselectedStars.every((star) => !star?.classList.contains('fill-accent')),
		).toBe(true)
	})

	it('reports changes without changing a controlled value internally', async () => {
		const user = userEvent.setup()
		const onChange = vi.fn()
		render(<RatingStars value={2} onChange={onChange} />)

		const fourthStar = screen.getByRole('button', { name: '4 stars' })
		await user.click(fourthStar)
		await user.unhover(fourthStar)

		expect(onChange).toHaveBeenCalledWith(4)

		const stars = screen
			.getAllByRole('button')
			.map((b) => b.querySelector('svg'))
		expect(
			stars.slice(0, 2).every((s) => s?.classList.contains('fill-accent')),
		).toBe(true)
		expect(
			stars.slice(2).every((s) => !s?.classList.contains('fill-accent')),
		).toBe(true)
	})

	it('does not report changes when disabled', async () => {
		const user = userEvent.setup()
		const onChange = vi.fn()
		render(<RatingStars value={2} onChange={onChange} disabled />)

		await user.click(screen.getByRole('button', { name: '4 stars' }))

		expect(onChange).not.toHaveBeenCalled()
		expect(screen.getByRole('group')).toBeDisabled()
	})
})
