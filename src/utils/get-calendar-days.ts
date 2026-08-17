export function getCalendarDays(year: number, month: number) {
	const firstDay = new Date(year, month, 1).getDay()
	const daysInMonth = new Date(year, month + 1, 0).getDate()

	// Empty cells before the first day of the month
	const blanks = Array.from({ length: firstDay }, (_, i) => ({
		day: null,
		key: `blank-${i}`,
	}))

	const days = Array.from({ length: daysInMonth }, (_, i) => {
		const day = i + 1
		return {
			day,
			key: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
		}
	})

	return [...blanks, ...days]
}
