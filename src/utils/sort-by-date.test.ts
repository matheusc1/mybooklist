import { describe, expect, it } from 'vitest'
import { sortByDateDesc } from './sort-by-date'

describe('sortByDateDesc', () => {
	it('sorts items from newest to oldest', () => {
		const items = [
			{ id: 'old', date: '2024-01-01' },
			{ id: 'new', date: '2024-03-01' },
			{ id: 'middle', date: '2024-02-01' },
		]

		expect(sortByDateDesc(items, (item) => item.date)).toEqual([
			{ id: 'new', date: '2024-03-01' },
			{ id: 'middle', date: '2024-02-01' },
			{ id: 'old', date: '2024-01-01' },
		])
	})

	it('does not mutate the input array', () => {
		const items = [
			{ id: 'old', date: '2024-01-01' },
			{ id: 'new', date: '2024-03-01' },
		]

		sortByDateDesc(items, (item) => item.date)

		expect(items).toEqual([
			{ id: 'old', date: '2024-01-01' },
			{ id: 'new', date: '2024-03-01' },
		])
	})

	it('handles empty and equal-date arrays', () => {
		expect(sortByDateDesc([], () => '')).toEqual([])

		const items = [
			{ id: 'first', date: '2024-01-01' },
			{ id: 'second', date: '2024-01-01' },
		]

		expect(sortByDateDesc(items, (item) => item.date)).toEqual(items)
	})
})
