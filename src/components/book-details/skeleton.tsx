export function BookDetailsSkeleton() {
	return (
		<main className="mx-auto min-h-[calc(100vh-69px)] w-full max-w-275 p-5 lg:p-10">
			<div className="animate-pulse space-y-8">
				<div className="h-4 w-24 rounded bg-surface2" />
				<div className="flex gap-6">
					<div className="aspect-2/3 w-24 rounded-lg bg-surface2 md:w-33" />
					<div className="flex-1 space-y-4">
						<div className="h-3 w-20 rounded bg-surface2" />
						<div className="h-8 max-w-80 rounded bg-surface2" />
						<div className="h-4 max-w-48 rounded bg-surface2" />
					</div>
				</div>
				<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
					{Array.from({ length: 4 }, (_, index) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: static
							key={index}
							className="h-20 rounded-xl border border-border bg-surface"
						/>
					))}
				</div>
			</div>
		</main>
	)
}
