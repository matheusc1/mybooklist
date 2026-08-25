export function formatReadingTime(
	totalMinutes: number,
	precision: 'hours' | 'full' = 'full',
) {
	const hours = Math.floor(totalMinutes / 60)
	const minutes = totalMinutes % 60

	if (precision === 'hours') {
		return hours === 0 ? '~1h' : `~${hours}h`
	}

	if (hours === 0) return `~${minutes}m`
	if (minutes === 0) return `~${hours}h`
	return `~${hours}h ${minutes}m`
}
