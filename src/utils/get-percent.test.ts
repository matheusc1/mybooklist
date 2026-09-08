import { describe, expect, it } from 'vitest'
import { getPercent } from './get-percent'

describe('getPercent', () => {
	it('returns zero when the target is zero or negative', () => {
		expect(getPercent(5, 0)).toBe(0)
		expect(getPercent(5, -10)).toBe(0)
	})

	it('returns the floored percentage for partial progress', () => {
		expect(getPercent(1, 3)).toBe(33)
		expect(getPercent(25, 100)).toBe(25)
	})

	it('returns zero when there is no progress', () => {
		expect(getPercent(0, 100)).toBe(0)
	})

	it('caps progress at one hundred percent', () => {
		expect(getPercent(125, 100)).toBe(100)
	})
})
