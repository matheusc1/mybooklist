import { describe, expect, it } from 'vitest'
import { render, screen } from '#/test/test-utils'
import { BookMetadata } from './book-metadata'

describe('BookMetadata', () => {
	it('renders start and finish dates and plural elapsed time', () => {
		render(
			<BookMetadata
				startedAt="2024-01-02"
				completedAt="2024-02-02"
				elapsedDays={31}
				showTimeTaken
			/>,
		)

		expect(screen.getByText('Started')).toBeInTheDocument()
		expect(screen.getByText('Jan 2, 2024')).toBeInTheDocument()
		expect(screen.getByText('Finished')).toBeInTheDocument()
		expect(screen.getByText('Feb 2, 2024')).toBeInTheDocument()
		expect(screen.getByText('31 days')).toBeInTheDocument()
	})

	it('uses singular elapsed-time copy and can hide the time-taken item', () => {
		const { rerender } = render(
			<BookMetadata
				startedAt={null}
				completedAt={null}
				elapsedDays={1}
				showTimeTaken
			/>,
		)

		expect(screen.getByText('1 day')).toBeInTheDocument()

		rerender(
			<BookMetadata
				startedAt={null}
				completedAt={null}
				elapsedDays={1}
				showTimeTaken={false}
			/>,
		)

		expect(screen.queryByText('Time Taken')).not.toBeInTheDocument()
		expect(screen.queryByText('1 day')).not.toBeInTheDocument()
	})

	it('renders nothing when no metadata is available', () => {
		const { container } = render(
			<BookMetadata
				startedAt={null}
				completedAt={null}
				elapsedDays={null}
				showTimeTaken
			/>,
		)

		expect(container).toBeEmptyDOMElement()
	})
})
