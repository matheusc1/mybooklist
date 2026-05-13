import { createFileRoute, Link } from '@tanstack/react-router'
import { LucidePlus } from 'lucide-react'
import { BookActivityCard } from '#/components/book-activity-card'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/_authenticated/')({ component: Home })

const bookActivityData = [
	{
		image: '/book-cover.jpg',
		title: 'Crime and Punishment',
		author: 'Fyodor Dostoevsky',
		status: 'reading' as const,
		date: 'Oct 10, 2025',
	},
	{
		image: '/book-cover.jpg',
		title: 'The Final Empire',
		author: 'Brandon Sanderson',
		status: 'finished' as const,
		date: 'Oct 8, 2025',
	},
	{
		image: '/book-cover.jpg',
		title: 'Brave New World',
		author: 'Aldous Huxley',
		status: 'want-to-read' as const,
		date: 'Oct 1, 2025',
	},
]

function Home() {
	return (
		<div className="h-[calc(100vh-69px)] grid grid-cols-[300px_1fr_280px] divide-x divide-border">
			<div className="flex flex-col gap-6 justify-start p-7">
				<div className="w-full flex items-baseline justify-between">
					<h2 className="font-serif font-semibold tracking-tight text-xl">
						Bookshelf
					</h2>
					<Link
						to="/books"
						className="uppercase text-muted text-xs transition-colors tracking-[0.06em] hover:text-accent"
					>
						View all
					</Link>
				</div>

				<div className="bg-surface border border-border rounded-xl overflow-hidden">
					<div className="h-0.5 bg-gradient-progress" />
					<div className="p-5 flex flex-col gap-3">
						<span className="text-accent text-xs uppercase tracking-widest font-medium">
							Currently Reading
						</span>

						<div className="flex gap-3.5 items-start">
							<div className="w-13.5 h-19 rounded-md bg-surface2 shrink-0 flex items-center justify-center text-2xl shadow-[4px_4px_16px_rgba(0,0,0,0.5)]">
								📖
							</div>

							<div className="flex flex-col flex-1">
								<span className="font-serif font-semibold leading-snug">
									The Hobbit
								</span>
								<span className="text-muted text-xs mt-0.5 mb-2.5">
									J.R.R. Tolkien
								</span>

								<div className="flex justify-between text-xs text-muted mb-1.5">
									<span>Page 150 of 260</span>
									<span className="text-accent font-medium">58%</span>
								</div>
								<div className="h-0.75 bg-surface2 rounded-full overflow-hidden">
									<div
										className="h-full bg-gradient-progress rounded-full"
										style={{ width: '58%' }}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<p className="text-xs text-muted font-medium uppercase tracking-widest">
					Recent Activity
				</p>

				<div className="-mt-3 divide-y divide-border">
					{bookActivityData.map((activity, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: will be replaced with real data soon
						<BookActivityCard key={index} activity={activity} />
					))}
				</div>
			</div>

			<div className="flex flex-col gap-6 justify-start p-7">
				<div className="w-full flex items-center justify-between">
					<h2 className="font-serif font-semibold tracking-tight text-xl">
						Weekly Stats
					</h2>
					<Button variant="primary" size="sm">
						<LucidePlus className="size-3" />
						Add Record
					</Button>
				</div>
			</div>

			<div className="flex flex-col gap-6 justify-start p-7">
				<h2 className="font-serif font-semibold tracking-tight text-xl">
					Finished
				</h2>
			</div>
		</div>
	)
}
