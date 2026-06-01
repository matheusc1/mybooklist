export function sortByDateDesc<T>(
	items: T[],
	getDate: (item: T) => string,
): T[] {
	return [...items]
		.map((item) => ({ item, time: new Date(getDate(item)).getTime() }))
		.sort((a, b) => b.time - a.time)
		.map(({ item }) => item)
}
