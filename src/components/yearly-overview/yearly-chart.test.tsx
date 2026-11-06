import { describe, expect, it } from 'vitest'
import { render, screen } from '#/test/test-utils'
import { YearlyChart } from './yearly-chart'

describe('YearlyChart', () => {
	it('exposes the whole year as an accessible summary', () => {
		render(<YearlyChart pagesByMonth={[10, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 5]} />)

		expect(
			screen.getByRole('img', {
				name: 'Yearly reading chart. Jan: 10 pages, Feb: 0 pages, Mar: 1 page, Apr: 0 pages, May: 0 pages, Jun: 0 pages, Jul: 0 pages, Aug: 0 pages, Sep: 0 pages, Oct: 0 pages, Nov: 0 pages, Dec: 5 pages',
			}),
		).toBeInTheDocument()
	})

	it('highlights the most active month and scales the other bars against it', () => {
		const { container } = render(
			<YearlyChart pagesByMonth={[10, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 5]} />,
		)

		const highlighted = container.querySelectorAll('.from-accent')
		const regular = container.querySelectorAll('.from-accent2')
		expect(highlighted).toHaveLength(1)
		expect(highlighted[0]).toHaveStyle({ height: '100%' })
		expect(regular).toHaveLength(2)
		expect(regular[0]).toHaveStyle({ height: '10%' })
		expect(regular[1]).toHaveStyle({ height: '50%' })
		expect(container.querySelectorAll('.bg-surface3')).toHaveLength(9)
	})

	it('keeps a minimum height for a month with very little reading', () => {
		const { container } = render(
			<YearlyChart pagesByMonth={[1000, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]} />,
		)

		const [small] = Array.from(container.querySelectorAll('.from-accent2'))
		expect(small).toHaveStyle({ height: '3%' })
	})

	it('renders every month as an empty stub, with no highlight, for a year without reading', () => {
		const { container } = render(
			<YearlyChart pagesByMonth={Array(12).fill(0)} />,
		)

		expect(container.querySelectorAll('.bg-surface3')).toHaveLength(12)
		expect(container.querySelectorAll('.from-accent')).toHaveLength(0)
		expect(container.querySelectorAll('.from-accent2')).toHaveLength(0)
	})
})
