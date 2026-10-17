import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '#/test/test-utils'
import { Textarea } from './textarea'

describe('Textarea', () => {
	it('renders a controlled value and native character limit', () => {
		render(
			<Textarea
				aria-label="Notes"
				value="A note"
				onChange={vi.fn()}
				maxLength={5000}
			/>,
		)

		expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue('A note')
		expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveAttribute(
			'maxLength',
			'5000',
		)
		expect(screen.getByText('6/5000')).toHaveClass('text-muted')
	})

	it('describes the field with the character counter', () => {
		render(
			<>
				<p id="hint">Visible to you only</p>
				<Textarea
					aria-label="Notes"
					aria-describedby="hint"
					value="A note"
					onChange={vi.fn()}
					maxLength={5000}
				/>
			</>,
		)

		expect(
			screen.getByRole('textbox', { name: 'Notes' }),
		).toHaveAccessibleDescription('Visible to you only 6/5000')
	})

	it('calls onChange with the updated value and warns at 90 percent', () => {
		const onChange = vi.fn()
		const nearLimitValue = 'a'.repeat(4500)
		render(
			<Textarea
				aria-label="Notes"
				value={nearLimitValue}
				onChange={onChange}
				maxLength={5000}
			/>,
		)

		fireEvent.change(screen.getByRole('textbox', { name: 'Notes' }), {
			target: { value: `${nearLimitValue}b` },
		})

		expect(onChange).toHaveBeenCalledWith(`${nearLimitValue}b`)
		expect(screen.getByText('4500/5000')).toHaveClass('text-danger')
	})

	it('keeps the counter muted just below 90 percent', () => {
		render(
			<Textarea
				aria-label="Notes"
				value={'a'.repeat(4499)}
				onChange={vi.fn()}
				maxLength={5000}
			/>,
		)

		expect(screen.getByText('4499/5000')).toHaveClass('text-muted')
	})

	it('uses the placeholder passed by the caller', () => {
		render(
			<Textarea
				aria-label="Notes"
				placeholder="Write here"
				value=""
				onChange={vi.fn()}
				maxLength={5000}
			/>,
		)

		expect(screen.getByPlaceholderText('Write here')).toBeInTheDocument()
	})
})
