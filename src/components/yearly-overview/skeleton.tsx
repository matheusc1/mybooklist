import { Skeleton } from '../ui/skeleton'

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]

const CHART_BAR_HEIGHTS = [
	'h-1',
	'h-10',
	'h-6',
	'h-20',
	'h-14',
	'h-8',
	'h-24',
	'h-12',
	'h-18',
	'h-7',
	'h-16',
	'h-4',
]

const COMPLETED_BOOK_PLACEHOLDERS = [
	'book-one',
	'book-two',
	'book-three',
	'book-four',
	'book-five',
]

export function YearlyOverviewSkeleton() {
	return (
		<section aria-busy="true" aria-label="Loading yearly overview">
			<div aria-hidden="true">
				<div className="space-y-4">
					<section className="rounded-xl border border-border bg-surface p-4 lg:p-5">
						<div className="mb-3 flex items-center justify-between gap-3">
							<Skeleton className="h-3 w-36 rounded" />
							<Skeleton className="h-5 w-20 rounded-full" />
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Skeleton className="h-8 w-12 rounded" />
								<Skeleton className="h-4 w-24 rounded" />
							</div>
							<Skeleton className="h-1.5 w-full rounded-full" />
							<Skeleton className="h-3 w-40 rounded" />
						</div>
					</section>

					<section className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
						{['sessions', 'pages', 'reading-time', 'active-days'].map((key) => (
							<div
								key={key}
								className="space-y-1 rounded-xl border border-border bg-surface p-3 lg:p-4"
							>
								<Skeleton className="h-5 w-12 rounded" />
								<Skeleton className="h-3 w-20 rounded" />
							</div>
						))}
					</section>

					<section className="mb-4 rounded-xl border border-border bg-surface px-6 py-5">
						<Skeleton className="mb-3.5 h-3 w-40 rounded" />
						<div className="flex items-end gap-1 lg:gap-2.5">
							{MONTHS.map((month, index) => (
								<div
									key={month}
									className="flex flex-1 flex-col items-center gap-2"
								>
									<div className="flex h-32 w-full items-end">
										<Skeleton
											className={`w-full rounded-t ${CHART_BAR_HEIGHTS[index]}`}
										/>
									</div>
									<Skeleton className="h-3 w-full max-w-8 rounded" />
								</div>
							))}
						</div>
					</section>
				</div>

				<div className="mt-8">
					<Skeleton className="h-6 w-40 rounded" />

					<div className="mb-3 mt-6 flex items-baseline gap-3 border-b border-border pb-2.5">
						<Skeleton className="h-6 w-28 rounded" />
						<Skeleton className="h-3 w-14 rounded" />
					</div>

					<ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
						{COMPLETED_BOOK_PLACEHOLDERS.map((key) => (
							<li key={key}>
								<Skeleton className="mb-2.5 aspect-2/3 w-full rounded-lg" />
								<Skeleton className="mb-1 h-4 w-4/5 rounded" />
								<Skeleton className="h-3 w-1/2 rounded" />
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	)
}
