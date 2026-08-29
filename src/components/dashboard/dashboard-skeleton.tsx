/** biome-ignore-all lint/suspicious/noArrayIndexKey: static data */
import { Skeleton } from '../ui/skeleton'

export function DashboardSkeleton() {
	return (
		<main className="min-h-[calc(100vh-69px)] overflow-hidden grid md:grid-cols-[268px_1fr_224px] lg:grid-cols-[300px_1fr_280px] md:divide-x divide-border">
			<section
				aria-labelledby="bookshelf-heading"
				className="flex flex-col gap-6 justify-start px-5 lg:px-7 py-6"
			>
				<div className="w-full flex items-baseline justify-between">
					<h2
						id="bookshelf-heading"
						className="font-serif font-semibold tracking-tight text-xl"
					>
						Bookshelf
					</h2>

					<span className="uppercase text-muted text-xs tracking-[0.06em]">
						View all
					</span>
				</div>

				<Skeleton className="h-36 w-full rounded-lg" />

				<h3 className="text-xs text-muted font-medium uppercase tracking-widest">
					Recent Activity
				</h3>

				<div className="space-y-3">
					{Array.from({ length: 3 }).map((_, index) => (
						<Skeleton key={index} className="h-15 rounded-sm w-full" />
					))}
				</div>
			</section>

			<section
				aria-labelledby="weekly-stats-heading"
				className="flex flex-col gap-6 justify-start px-5 lg:px-7 py-6"
			>
				<div className="w-full flex items-center justify-between">
					<h2
						id="weekly-stats-heading"
						className="font-serif font-semibold tracking-tight text-xl"
					>
						Weekly Stats
					</h2>

					<Skeleton className="h-7 w-32 rounded-md" />
				</div>

				<div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 mb-1 [&>*:last-child]:md:col-span-2 [&>*:last-child]:lg:col-span-1">
					{Array.from({ length: 3 }).map((_, index) => (
						<Skeleton key={index} className="h-16 lg:h-18 rounded-xl" />
					))}
				</div>

				<Skeleton className="h-43 lg:h-46 rounded-xl" />

				<Skeleton className="h-24 rounded-xl" />
			</section>

			<section
				aria-labelledby="completed-heading"
				className="flex gap-6 flex-col justify-start px-5 lg:px-7 py-6"
			>
				<h2
					id="completed-heading"
					className="font-serif font-semibold tracking-tight text-xl"
				>
					Completed
				</h2>

				<div className="space-y-3">
					{Array.from({ length: 3 }).map((_, index) => (
						<Skeleton key={index} className="h-20 rounded w-full" />
					))}
				</div>

				<Skeleton className="h-39 w-full rounded-lg" />
			</section>
		</main>
	)
}
