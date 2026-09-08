import { describe, expect, it } from 'vitest'
import { getCalendarDays } from './get-calendar-days'

describe('getCalendarDays', () => {
	it('includes leading blanks and correctly keyed days', () => {
		const days = getCalendarDays(2024, 0)

		expect(days.slice(0, 1)).toEqual([{ day: null, key: 'blank-0' }])
		expect(days.at(-1)).toEqual({ day: 31, key: '2024-01-31' })
		expect(days).toHaveLength(32)
	})

	it('handles February in a leap year', () => {
		const days = getCalendarDays(2024, 1)

		expect(days.filter(({ day }) => day !== null)).toHaveLength(29)
		expect(days.at(-1)).toEqual({ day: 29, key: '2024-02-29' })
	})

	it('handles February in a non-leap year', () => {
		const days = getCalendarDays(2023, 1)

		expect(days.filter(({ day }) => day !== null)).toHaveLength(28)
		expect(days.at(-1)).toEqual({ day: 28, key: '2023-02-28' })
	})

	it('supports months that begin on Sunday without leading blanks', () => {
		const days = getCalendarDays(2023, 0)

		expect(days[0]).toEqual({ day: 1, key: '2023-01-01' })
		expect(days).toHaveLength(31)
	})
})
