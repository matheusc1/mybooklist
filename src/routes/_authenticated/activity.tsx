import { createFileRoute } from '@tanstack/react-router'
import { Calendar } from '#/components/calendar'
import { StatCard } from '#/components/stat-card'

export const Route = createFileRoute('/_authenticated/activity')({
	component: Activity,
})

const sessions = {
	'2026-05-01': [
		{
			book: 'The Hobbit',
			author: 'J.R.R. Tolkien',
			pages: [130, 150],
			time: '32min',
		},
	],
	'2026-05-02': [
		{
			book: 'Crime and Punishment',
			author: 'Fyodor Dostoevsky',
			pages: [80, 104],
			time: '48min',
		},
	],
	'2026-05-03': [
		{
			book: 'The Hobbit',
			author: 'J.R.R. Tolkien',
			pages: [150, 168],
			time: '28min',
		},
		{
			book: 'Sapiens',
			author: 'Yuval Noah Harari',
			pages: [200, 224],
			time: '40min',
		},
	],
	'2026-05-05': [
		{
			book: 'The Hobbit',
			author: 'J.R.R. Tolkien',
			pages: [168, 190],
			time: '35min',
		},
	],
	'2026-05-06': [
		{
			book: 'Crime and Punishment',
			author: 'Fyodor Dostoevsky',
			pages: [104, 122],
			time: '30min',
		},
	],
	'2026-05-08': [
		{
			book: 'Sapiens',
			author: 'Yuval Noah Harari',
			pages: [224, 260],
			time: '55min',
		},
	],
	'2026-05-09': [
		{
			book: 'The Hobbit',
			author: 'J.R.R. Tolkien',
			pages: [190, 210],
			time: '32min',
		},
		{
			book: 'Crime and Punishment',
			author: 'Fyodor Dostoevsky',
			pages: [122, 140],
			time: '28min',
		},
	],
	'2026-05-11': [
		{
			book: 'The Hobbit',
			author: 'J.R.R. Tolkien',
			pages: [210, 230],
			time: '30min',
		},
	],
	'2026-05-12': [
		{
			book: 'Crime and Punishment',
			author: 'Fyodor Dostoevsky',
			pages: [140, 165],
			time: '44min',
		},
	],
	'2026-05-14': [
		{
			book: 'The Hobbit',
			author: 'J.R.R. Tolkien',
			pages: [230, 260],
			time: '50min',
		},
	],
	'2026-05-15': [
		{
			book: 'Dune',
			author: 'Frank Herbert',
			pages: [1, 40],
			time: '1h 10min',
		},
	],
	'2026-05-16': [
		{
			book: 'Dune',
			author: 'Frank Herbert',
			pages: [40, 72],
			time: '55min',
		},
	],
	'2026-05-17': [
		{
			book: 'Dune',
			author: 'Frank Herbert',
			pages: [72, 98],
			time: '42min',
		},
		{
			book: 'Crime and Punishment',
			author: 'Fyodor Dostoevsky',
			pages: [165, 180],
			time: '25min',
		},
	],
	'2026-05-19': [
		{
			book: 'Dune',
			author: 'Frank Herbert',
			pages: [98, 130],
			time: '52min',
		},
	],
}

const today = new Date()
const currentMonthLabel = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	year: 'numeric',
}).format(today)

function Activity() {
	return (
		<div className="min-h-[calc(100vh-69px)] w-full max-w-250 mx-auto p-5 lg:p-10 space-y-10">
			<div className="space-y-1.5">
				<p className="font-mono text-xs text-accent uppercase tracking-widest">
					History
				</p>
				<h1 className="font-serif font-bold text-3xl/[1.0] tracking-tight">
					Activity
				</h1>
				<p className="text-muted text-xs tracking-wider">{currentMonthLabel}</p>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3">
				<StatCard
					value="18"
					label="Sessions this month"
					textColor="text-accent"
				/>
				<StatCard value="342" label="Pages this month" />
				<StatCard value="~14h" label="Reading time" textColor="text-accent2" />
				<StatCard value="12" label="Active Days" />
			</div>

			<Calendar sessions={sessions} />
		</div>
	)
}
