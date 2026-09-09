import { describe, expect, it } from 'vitest'
import { render, screen } from '#/test/test-utils'
import { FieldError } from './field-error'

describe('FieldError', () => {
	it('renders nothing when there is no message', () => {
		const { container } = render(<FieldError />)

		expect(container).toBeEmptyDOMElement()
	})

	it('renders the message and supplied id', () => {
		render(<FieldError id="title-error" message="Title is required" />)

		expect(screen.getByText('Title is required')).toHaveAttribute(
			'id',
			'title-error',
		)
	})
})
