import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import {
	formatBookDate,
	formatShortDate,
	getElapsedDays,
	getTodayDate,
} from './format-date'

describe('formatBookDate', () => {
	const originalTZ = process.env.TZ

	beforeAll(() => {
		process.env.TZ = 'America/Sao_Paulo' // UTC-3
	})

	afterAll(() => {
		process.env.TZ = originalTZ
	})

	it('does not shift the date backward in a negative UTC offset timezone', () => {
		expect(formatBookDate('2024-01-15')).toBe('Jan 15, 2024')
	})

	it('formats timestamps that use a space between date and time', () => {
		expect(formatBookDate('2024-01-15 18:30:00')).toBe('Jan 15, 2024')
	})

	it('returns "Invalid Date" for a malformed date string, without throwing', () => {
		expect(formatBookDate('not-a-date')).toBe('Invalid Date')
	})
})

describe('getTodayDate', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it('returns today as an ISO date string', () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date(2024, 6, 9, 14, 30))

		expect(getTodayDate()).toBe('2024-07-09')
	})
})

describe('formatShortDate', () => {
	it('formats date-only values without a year', () => {
		expect(formatShortDate('2024-01-15')).toBe('Jan 15')
	})
})

describe('getElapsedDays', () => {
	it('returns null when the book has not been started', () => {
		expect(getElapsedDays(null, '2024-01-11')).toBeNull()
	})

	it('returns null when the book has not been completed', () => {
		expect(getElapsedDays('2024-01-01', null)).toBeNull()
	})

	it('counts the days between the start and the completion', () => {
		expect(getElapsedDays('2024-01-01', '2024-01-11')).toBe(10)
	})

	it('counts at least one day when started and completed on the same day', () => {
		expect(getElapsedDays('2024-01-01', '2024-01-01')).toBe(1)
	})

	it('is not thrown off by daylight saving changes', () => {
		expect(getElapsedDays('2024-03-09', '2024-03-11')).toBe(2)
		expect(getElapsedDays('2024-10-31', '2024-11-04')).toBe(4)
	})
})
