import { describe, expect, it } from 'vitest'
import { render, screen } from '#/test/test-utils'
import { BookDetailsSkeleton } from './skeleton'

describe('BookDetailsSkeleton', () => {
	it('mirrors the book header, statistics, session list, and notes layout', () => {
		render(<BookDetailsSkeleton />)

		const main = screen.getByRole('main', { name: 'Loading book details' })
		expect(main).toHaveAttribute('aria-busy', 'true')
		expect(
			screen.getByRole('region', { name: 'Loading reading statistics' }),
		).toBeInTheDocument()
		expect(
			screen.getByRole('region', { name: 'Loading reading sessions' }),
		).toBeInTheDocument()
		expect(
			screen.getByRole('complementary', { name: 'Loading book notes' }),
		).toBeInTheDocument()

		expect(main.querySelector('[class*="aspect-2/3"]')).toBeInTheDocument()
		expect(
			main.querySelector('[class*="lg:grid-cols-[minmax(0,1fr)_340px]"]'),
		).toBeInTheDocument()
		expect(main.querySelector('[class*="min-h-56"]')).toBeInTheDocument()
	})
})
