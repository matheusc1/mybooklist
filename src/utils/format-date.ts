export function formatBookDate(date: string) {
	const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(date)
	const isoString = isDateOnly ? `${date}T12:00:00` : date.replace(' ', 'T')

	return new Date(isoString).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})
}

export function getTodayDate() {
	const today = new Date()
	const year = today.getFullYear()
	const month = String(today.getMonth() + 1).padStart(2, '0')
	const day = String(today.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

export function formatShortDate(date: string) {
	return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
	})
}

function getDaysBetween(start: string, end: string) {
	const startDate = new Date(`${start}T12:00:00`)
	const endDate = new Date(`${end}T12:00:00`)

	return Math.max(
		1,
		Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000),
	)
}

export function getElapsedDays(
	startedAt: string | null,
	completedAt: string | null,
) {
	if (!startedAt || !completedAt) return null
	return getDaysBetween(startedAt, completedAt)
}
