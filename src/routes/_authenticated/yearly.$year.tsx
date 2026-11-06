import { createFileRoute, notFound } from '@tanstack/react-router'
import { GoalCard } from '#/components/goal-card'
import { CompletedBooks } from '#/components/yearly-overview/completed-books'
import { YearSwitcher } from '#/components/yearly-overview/year-switcher'
import { YearlyChart } from '#/components/yearly-overview/yearly-chart'
import { YearlyStats } from '#/components/yearly-overview/yearly-stats'
import { useYearlyOverview } from '#/hooks/use-yearly-overview'

const MIN_YEAR = 1000
const MAX_YEAR = 9999

function isValidYear(year: number) {
	return Number.isInteger(year) && year >= MIN_YEAR && year <= MAX_YEAR
}

export const Route = createFileRoute('/_authenticated/yearly/$year')({
	params: {
		parse: ({ year }) => ({ year: Number(year) }),
		stringify: ({ year }) => ({ year: String(year) }),
	},
	beforeLoad: ({ params }) => {
		if (!isValidYear(params.year)) throw notFound()
	},
	head: () => ({
		meta: [{ title: 'Yearly Overview | MyBookList' }],
	}),
	component: YearlyOverview,
})

function YearlyOverview() {
	const { year } = Route.useParams()
	const { data: overview, isLoading } = useYearlyOverview(year)

	const currentYear = new Date().getFullYear()
	const isCurrentYear = year === currentYear

	if (isLoading) return <p>Loading...</p>

	return (
		<main className="min-h-[calc(100vh-69px)] mx-auto w-full max-w-260 px-5 md:px-10 pt-10 pb-28 animate-fade-up">
			<header className="mb-8 flex flex-wrap items-end justify-between gap-5">
				<div className="space-y-1.5">
					<p className="font-mono text-xs text-accent uppercase tracking-widest">
						History
					</p>
					<h1 className="font-serif font-bold text-3xl/[1.0] tracking-tight">
						Yearly Stats
					</h1>
				</div>

				<YearSwitcher year={year} isCurrentYear={isCurrentYear} />
			</header>

			{overview?.yearlyStats && (
				<div className="space-y-4">
					<GoalCard goal={overview?.goal} showInProgress={isCurrentYear} />
					<YearlyStats stats={overview?.yearlyStats} />
					<YearlyChart pagesByMonth={overview?.yearlyStats.pagesByMonth} />
				</div>
			)}

			{overview?.completedBooks && overview.completedBooks.length > 0 && (
				<CompletedBooks completedBooks={overview.completedBooks} />
			)}
		</main>
	)
}
