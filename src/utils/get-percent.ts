export function getPercent(current: number, target: number) {
	if (target <= 0) return 0
	return Math.min(Math.round((current / target) * 100), 100)
}
