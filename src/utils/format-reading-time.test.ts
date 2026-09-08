import { describe, expect, it } from 'vitest'
import { formatReadingTime } from './format-reading-time'

describe('formatReadingTime', () => {
	it('formats minutes when the duration is less than one hour', () => {
		expect(formatReadingTime(0)).toBe('~0m')
		expect(formatReadingTime(45)).toBe('~45m')
	})

	it('formats exact hours without minutes', () => {
		expect(formatReadingTime(120)).toBe('~2h')
	})

	it('formats hours and remaining minutes', () => {
		expect(formatReadingTime(135)).toBe('~2h 15m')
	})

	it('formats hour precision with a minimum of one hour', () => {
		expect(formatReadingTime(45, 'hours')).toBe('~1h')
		expect(formatReadingTime(135, 'hours')).toBe('~2h')
	})
})
