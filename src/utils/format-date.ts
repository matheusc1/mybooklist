export function formatBookDate(date: string) {
	return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})
}
