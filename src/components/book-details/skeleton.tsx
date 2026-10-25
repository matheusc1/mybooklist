import { Skeleton } from '../ui/skeleton'

const SESSION_PLACEHOLDERS = ['session-one', 'session-two', 'session-three']

export function BookDetailsSkeleton() {
	return (
		<main
			aria-busy="true"
			aria-label="Loading book details"
			className="mx-auto min-h-[calc(100vh-69px)] w-full max-w-275 space-y-7 px-5 py-6 pb-10 lg:space-y-8 lg:px-10 lg:py-8"
		>
			<div className="flex items-center justify-between gap-3">
				<Skeleton className="h-3 w-12 rounded" />
				<Skeleton className="h-8 w-25 rounded-md" />
			</div>

			<section className="border-b border-border pb-7">
				<div className="flex items-start gap-5 md:gap-7">
					<Skeleton className="aspect-2/3 w-34 shrink-0 overflow-hidden rounded-lg border border-border shadow-xl sm:w-36" />

					<div className="flex min-w-0 flex-1 flex-col self-stretch">
						<Skeleton className="h-7 w-4/5 max-w-80 rounded sm:h-9" />
						<div className="mt-2 mb-4 flex flex-wrap items-center gap-2">
							<Skeleton className="h-4 w-2/5 max-w-48 rounded" />
							<Skeleton className="h-5 w-16 rounded-full" />
						</div>

						<div className="mb-5 flex flex-wrap items-center gap-3">
							<Skeleton className="h-7 w-25 rounded-md" />
							<Skeleton className="h-5 w-24 rounded" />
						</div>

						<div className="mt-auto max-w-xs">
							<div className="mb-2 flex justify-between gap-3">
								<Skeleton className="h-3 w-24 rounded" />
								<Skeleton className="h-3 w-8 rounded" />
							</div>
							<Skeleton className="h-1 w-full rounded-full" />

							<div className="mt-4 hidden min-[415px]:flex min-[415px]:flex-wrap min-[415px]:gap-x-8">
								<div className="space-y-1">
									<Skeleton className="h-2.5 w-12 rounded" />
									<Skeleton className="h-4 w-20 rounded" />
								</div>
								<div className="space-y-1">
									<Skeleton className="h-2.5 w-16 rounded" />
									<Skeleton className="h-4 w-20 rounded" />
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-4 flex gap-x-8 min-[415px]:hidden">
					<div className="space-y-1">
						<Skeleton className="h-2.5 w-12 rounded" />
						<Skeleton className="h-4 w-20 rounded" />
					</div>
					<div className="space-y-1">
						<Skeleton className="h-2.5 w-16 rounded" />
						<Skeleton className="h-4 w-20 rounded" />
					</div>
				</div>
			</section>

			<section
				aria-label="Loading reading statistics"
				className="grid grid-cols-2 gap-3 md:grid-cols-4"
			>
				{['time', 'sessions', 'active-days', 'elapsed-days'].map((key) => (
					<div
						key={key}
						className="rounded-xl border border-border bg-surface p-3 lg:p-4"
					>
						<Skeleton className="mb-2 h-5 w-12 rounded" />
						<Skeleton className="h-3 w-3/4 rounded" />
					</div>
				))}
			</section>

			<div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-7">
				<section aria-label="Loading reading sessions" className="min-w-0">
					<div className="mb-4 flex items-center justify-between gap-3">
						<div className="flex items-baseline gap-3">
							<Skeleton className="h-6 w-20 rounded" />
							<Skeleton className="h-3 w-16 rounded" />
						</div>
						<Skeleton className="h-8 w-27 rounded-md" />
					</div>

					<div className="overflow-hidden rounded-xl border border-border bg-surface">
						<div className="hidden grid-cols-[96px_minmax(0,1fr)_84px_80px_64px] gap-3 bg-surface2 px-4 py-3 md:grid">
							{['date', 'pages', 'read', 'time', 'actions'].map((key) => (
								<Skeleton key={key} className="h-3 w-3/4 rounded" />
							))}
						</div>

						<ul className="divide-y divide-border">
							{SESSION_PLACEHOLDERS.map((key) => (
								<li
									key={key}
									className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 px-4 py-3.5 md:grid-cols-[96px_minmax(0,1fr)_84px_80px_64px] md:gap-3"
								>
									<Skeleton className="col-start-1 row-start-1 h-3 w-20 rounded md:col-auto md:row-auto" />
									<div className="col-start-1 row-start-2 flex items-center gap-2 md:contents">
										<Skeleton className="h-3 w-20 rounded" />
										<Skeleton className="h-3 w-14 rounded" />
									</div>
									<Skeleton className="col-start-2 row-start-2 h-3 w-12 rounded md:col-auto md:row-auto" />
									<div className="col-start-2 row-start-1 flex justify-end gap-1 md:col-auto md:row-auto">
										<Skeleton className="size-7 rounded-md" />
										<Skeleton className="size-7 rounded-md" />
									</div>
								</li>
							))}
						</ul>
					</div>
				</section>

				<aside
					aria-label="Loading book notes"
					className="min-w-0 lg:sticky lg:top-24"
				>
					<div className="mb-4 flex items-baseline justify-between">
						<Skeleton className="h-6 w-20 rounded" />
						<Skeleton className="h-3 w-10 rounded" />
					</div>
					<Skeleton className="min-h-56 w-full rounded-md" />
				</aside>
			</div>
		</main>
	)
}
