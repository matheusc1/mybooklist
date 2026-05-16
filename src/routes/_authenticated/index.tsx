import { createFileRoute, Link } from '@tanstack/react-router'
import { LucidePlus } from 'lucide-react'
import { BookActivityCard } from '#/components/book-activity-card'
import { FinishedBookCard } from '#/components/finished-book-card'
import { StatCard } from '#/components/stat-card'
import { Button } from '#/components/ui/button'
import { WeeklyChart } from '#/components/weekly-chart'

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

const finishedBooksData = [
	{
		image: '/book-cover.jpg',
		title: 'White Nights',
		author: 'Fyodor Dostoevsky',
		rating: 4,
		date: 'Oct 20, 2025',
	},
	{
		image: '/book-cover.jpg',
		title: '1984',
		author: 'George Orwell',
		rating: 5,
		date: 'Nov 9, 2025',
	},
	{
		image: '/book-cover.jpg',
		title: 'We',
		author: 'Yevgeny Zamyatin',
		rating: 4,
		date: 'Sep 1, 2025',
	},
]

function Home() {
	return (
		<div className="h-[calc(100vh-69px)] grid md:grid-cols-[268px_1fr_224px] lg:grid-cols-[300px_1fr_280px] divide-x divide-border">
			<div className="flex flex-col gap-6 justify-start px-5 lg:px-7 py-6">
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

				<div className="-mt-3">
					{bookActivityData.map((activity, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: will be replaced with real data soon
						<BookActivityCard key={index} activity={activity} />
					))}
				</div>
			</div>

			<div className="flex flex-col gap-6 justify-start px-5 lg:px-7 py-6">
				<div className="w-full flex items-center justify-between">
					<h2 className="font-serif font-semibold tracking-tight text-xl">
						Weekly Stats
					</h2>
					<Button variant="primary" size="sm">
						<LucidePlus className="size-3 md:hidden lg:block" />
						Add Record
					</Button>
				</div>

				<div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 mb-1 [&>*:last-child]:md:col-span-2 [&>*:last-child]:lg:col-span-1">
					<StatCard value={148} label="Pages read" textColor="text-accent" />
					<StatCard
						value="2h 02m"
						label="Hours read"
						textColor="text-accent2"
					/>
					<StatCard value={7} label="Days streak" />
				</div>

				<div className="flex flex-col gap-5 bg-surface rounded-xl border border-border p-4 lg:p-6">
					<p className="text-xs text-muted font-medium uppercase tracking-widest">
						Pages per day
					</p>
					<WeeklyChart />
				</div>

				<div className="flex items-center justify-between bg-surface rounded-xl border border-border py-5 px-4 lg:px-6">
					<div className="flex flex-col gap-1.5">
						<p className="text-xs text-muted uppercase tracking-widest">
							This week
						</p>
						<p className="text-sm font-serif text-muted">
							<strong className="text-2xl text-text">2 </strong>
							hrs <strong className="text-2xl text-text">02 </strong>
							min
						</p>
					</div>
					<div className="flex flex-col text-right">
						<p className="text-xs text-muted">Most active day</p>
						<p className="text-sm font-mono text-accent2 font-medium">
							Tuesday ↑
						</p>
					</div>
				</div>
			</div>

			<div className="flex gap-6 flex-col justify-start px-5 lg:px-7 py-6">
				<h2 className="font-serif font-semibold tracking-tight text-xl">
					Finished
				</h2>

				<div className="-mt-3">
					{finishedBooksData.map((book, index) => (
						<FinishedBookCard
							// biome-ignore lint/suspicious/noArrayIndexKey: will be replaced with real data soon
							key={index}
							book={book}
						/>
					))}
				</div>

				<div className="p-4 lg:p-5 rounded-xl bg-surface border border-border">
					<p className="text-muted uppercase tracking-widest text-xs mb-3">
						READING GOAL · 2026
					</p>

					<div className="space-y-2">
						<div className="flex justify-between items-center">
							<span className="font-serif text-2xl font-semibold">24</span>
							<p className="text-sm text-muted">of 50 books</p>
						</div>

						<div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-progress rounded-full"
								style={{ width: '48%' }}
							/>
						</div>

						<p className="text-xs text-muted">
							62% complete · 5 months remaining
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
