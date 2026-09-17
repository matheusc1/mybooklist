import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '#/test/test-utils'
import { GenreSelector } from './genre-selector'

describe('GenreSelector', () => {
	it('renders the labelled trigger and placeholder', () => {
		render(<GenreSelector />)
		const trigger = screen.getByRole('combobox', { name: 'Genre' })
		expect(trigger).toHaveTextContent('Select a genre')
	})

	it('opens with all 16 application genre options and labels', async () => {
		const user = userEvent.setup()
		render(<GenreSelector />)
		await user.click(screen.getByRole('combobox', { name: 'Genre' }))

		expect(screen.getByText('Genres')).toBeInTheDocument()
		const options = screen.getAllByRole('option')
		expect(options).toHaveLength(16)
		for (const label of [
			'Fantasy',
			'Sci-Fi',
			'Literary Fiction',
			'Mystery / Thriller',
			'Romance',
			'Horror',
			'Self-help',
			'Science / Technology',
			'Classics',
			'Short Stories',
			'Non-fiction',
			'Biography',
			'History',
			'Philosophy',
			'Manga / Comics',
			'Other',
		]) {
			expect(screen.getByRole('option', { name: label })).toBeInTheDocument()
		}
	})

	it('reports the selected genre value', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		render(<GenreSelector onValueChange={onValueChange} />)
		await user.click(screen.getByRole('combobox', { name: 'Genre' }))
		await user.click(screen.getByRole('option', { name: 'Fantasy' }))

		expect(onValueChange).toHaveBeenCalledWith('fantasy')
	})

	it('renders a controlled selected genre', () => {
		render(<GenreSelector value="mystery-thriller" />)
		expect(screen.getByRole('combobox', { name: 'Genre' })).toHaveTextContent(
			'Mystery / Thriller',
		)
	})

	it('does not open when disabled', async () => {
		const user = userEvent.setup()
		render(<GenreSelector disabled />)
		const trigger = screen.getByRole('combobox', { name: 'Genre' })
		expect(trigger).toBeDisabled()
		await user.click(trigger)
		expect(screen.queryByText('Genres')).not.toBeInTheDocument()
	})
})
