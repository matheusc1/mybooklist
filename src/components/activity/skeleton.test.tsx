import { describe, expect, it } from 'vitest'
import { render, screen } from '#/test/test-utils'
import { ActivitySkeleton } from './skeleton'

describe('ActivitySkeleton', () => {
	it('renders the activity loading layout with disabled month controls', () => {
		render(<ActivitySkeleton />)

		expect(
			screen.getByRole('heading', { name: 'Activity' }),
		).toBeInTheDocument()
		expect(
			screen.getByRole('button', { name: 'Previous month' }),
		).toBeDisabled()
		expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled()
		expect(screen.getByText('Session logged')).toBeInTheDocument()
		expect(screen.getByText('Multiple sessions')).toBeInTheDocument()
		expect(document.querySelectorAll('.animate-pulse')).toHaveLength(39)
	})
})
