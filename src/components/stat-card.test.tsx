import { describe, expect, it } from 'vitest'
import { render, screen } from '#/test/test-utils'
import { StatCard } from './stat-card'

describe('StatCard', () => {
	it('renders the value with its label and color', () => {
		render(<StatCard label="Pages" value={840} textColor="text-accent" />)

		expect(screen.getByText('840')).toHaveClass('text-accent')
		expect(screen.getByText('Pages')).toBeInTheDocument()
		expect(screen.queryByText('No data yet')).not.toBeInTheDocument()
	})

	it('replaces the value with a placeholder and drops its color when empty', () => {
		render(<StatCard label="Pages" value={0} textColor="text-accent" isEmpty />)

		const placeholder = screen.getByText('--')
		expect(placeholder).toHaveAttribute('aria-hidden', 'true')
		expect(placeholder.parentElement).not.toHaveClass('text-accent')
		expect(screen.getByText('No data yet')).toBeInTheDocument()
		expect(screen.queryByText('0')).not.toBeInTheDocument()
		expect(screen.getByText('Pages')).toBeInTheDocument()
	})
})
