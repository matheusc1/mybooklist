export const BOOK_STATUS = {
	reading: {
		label: 'Reading',
		shortLabel: 'Reading',
		color: 'bg-accent2',
	},
	want: {
		label: 'Want to read',
		shortLabel: 'Planned',
		color: 'bg-mist',
	},
	paused: {
		label: 'Paused',
		shortLabel: 'Paused',
		color: 'bg-parchment',
	},
	finished: {
		label: 'Completed',
		shortLabel: 'Completed',
		color: 'bg-accent',
	},
	dropped: {
		label: 'Dropped',
		shortLabel: 'Dropped',
		color: 'bg-danger',
	},
} as const

export type ActivityStatus = keyof typeof BOOK_STATUS
