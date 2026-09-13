import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithRouter, screen } from '#/test/test-utils'
import { Activity } from './activity'

const activity = vi.hoisted(() => vi.fn())

vi.mock('#/hooks/use-activity', () => ({ useActivity: activity }))
vi.mock('#/components/modals/session-modal', () => ({
	SessionModal: ({ open }: { open: boolean }) =>
		open ? <div role="dialog">Session modal</div> : null,
}))

beforeEach(() => {
	vi.clearAllMocks()
	activity.mockReturnValue({
		data: {
			monthlyStats: { sessions: 1, pages: 10, readingTime: 30, activeDays: 1 },
			monthlyActivity: [],
		},
		isLoading: false,
	})
})

describe('Activity', () => {
	it('renders activity data and requests the actual previous month', async () => {
		const user = userEvent.setup()
		const today = new Date()
		const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1)
		const expectedMonth = `${previousMonth.getFullYear()}-${String(
			previousMonth.getMonth() + 1,
		).padStart(2, '0')}`
		renderWithRouter(<Activity />)

		expect(
			screen.getByRole('heading', { name: 'Activity' }),
		).toBeInTheDocument()
		await user.click(screen.getByRole('button', { name: 'Previous month' }))

		expect(activity).toHaveBeenLastCalledWith(expectedMonth)
	})

	it('renders the activity loading state', () => {
		activity.mockReturnValue({ data: undefined, isLoading: true })
		renderWithRouter(<Activity />)

		expect(
			screen.getByRole('heading', { name: 'Activity' }),
		).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled()
	})
})
