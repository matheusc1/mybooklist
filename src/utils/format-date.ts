export function formatBookDate(date: string) {
	const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(date)
	const isoString = isDateOnly ? `${date}T12:00:00` : date.replace(' ', 'T')

	return new Date(isoString).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})
}
