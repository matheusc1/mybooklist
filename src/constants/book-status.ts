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
		label: 'Finished',
		shortLabel: 'Finished',
		color: 'bg-accent',
	},
	abandoned: {
		label: 'Abandoned',
		shortLabel: 'Dropped',
		color: 'bg-danger',
	},
} as const

export type ActivityStatus = keyof typeof BOOK_STATUS
