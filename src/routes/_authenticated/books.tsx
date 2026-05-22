import { createFileRoute } from '@tanstack/react-router'
import { LucideLibrary, LucidePlus, LucideSearch, SearchX } from 'lucide-react'
import { useState } from 'react'
import { BookCard } from '#/components/book-card'
import { Button } from '#/components/ui/button'
import { books } from '#/mocks/books'
import type { ActivityStatus } from '#/types/types'

export const Route = createFileRoute('/_authenticated/books')({
	component: MyBooks,
})

type Filter = {
	label: string
	status: ActivityStatus | null
	color: string | null
	activeColor: string | null
}

const filters: Filter[] = [
	{ label: 'All', status: null, color: null, activeColor: null },
	{
		label: 'Reading',
		status: 'reading',
		color: 'bg-accent2/50',
		activeColor: 'bg-accent2',
	},
	{
		label: 'Want to read',
		status: 'want-to-read',
		color: 'bg-mist/50',
		activeColor: 'bg-mist',
	},
	{
		label: 'Finished',
		status: 'finished',
		color: 'bg-accent/50',
		activeColor: 'bg-accent',
	},
	{
		label: 'Paused',
		status: 'paused',
		color: 'bg-parchment/50',
		activeColor: 'bg-parchment',
	},
	{
		label: 'Abandoned',
		status: 'abandoned',
		color: 'bg-danger/50',
		activeColor: 'bg-danger',
	},
]

function MyBooks() {
	const [activeFilter, setActiveFilter] = useState<ActivityStatus | null>(null) // null = All
	const [search, setSearch] = useState('')

	const statusCounts = books.reduce(
		(acc, book) => {
			acc[book.status]++
			return acc
		},
		{
			reading: 0,
			finished: 0,
			paused: 0,
			abandoned: 0,
			'want-to-read': 0,
		} satisfies Record<ActivityStatus, number>,
	)

	const normalizedSearch = search.trim().toLowerCase()

	const filteredBooks = books.filter((book) => {
		const matchesStatus = activeFilter === null || book.status === activeFilter

		const matchesSearch =
			normalizedSearch === '' ||
			book.title.toLowerCase().includes(normalizedSearch) ||
			book.author.toLowerCase().includes(normalizedSearch)

		return matchesStatus && matchesSearch
	})

	const isEmpty = books.length === 0
	const isFilterEmpty = !isEmpty && filteredBooks.length === 0

	const emptyState = isEmpty
		? {
				icon: <LucideLibrary className="size-12 text-muted" />,
				title: 'Your library is empty',
				text: "Start building your collection by adding the first book you're reading or want to read.",
			}
		: {
				icon: <SearchX className="size-12 text-muted" />,
				title: 'No books here yet',
				text: 'No books match your current filters.',
			}

	return (
		<div className="min-h-[calc(100vh-69px)] w-full max-w-300 mx-auto p-5 lg:p-10 space-y-10">
			<div className="flex items-center justify-between  animate-fade-up [animation-delay:0.05s]">
				<div className="space-y-1.5">
					<p className="font-mono text-xs text-accent uppercase tracking-widest">
						Collection
					</p>
					<h1 className="font-serif font-bold text-3xl/[1.0] tracking-tight">
						My Books
					</h1>
					<p className="text-muted text-xs tracking-wider">
						{books.length} books
					</p>
				</div>

				<Button>
					<LucidePlus className="size-3" />
					Add Book
				</Button>
			</div>

			<div className="space-y-8 animate-fade-up [animation-delay:0.1s]">
				<div className="flex items-center gap-3 gap-y-1 flex-wrap">
					<div className="relative flex-1 max-w-75 min-w-50">
						<LucideSearch className="absolute size-4 left-4 top-[50%] transform translate-y-[-50%] text-muted pointer-events-none" />
						<input
							type="text"
							placeholder="Search by title or author..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full text-sm bg-surface border border-border py-2.5 pl-10 pr-5 rounded-lg placeholder:text-muted/55 outline-none input-focus"
						/>
					</div>

					<div className="flex flex-wrap items-center justify-start gap-1">
						{filters.map(({ label, status, color, activeColor }) => {
							const isActive = activeFilter === (status ?? null)
							const dotColor = isActive ? activeColor : color

							return (
								<Button
									key={label}
									variant="ghost"
									onClick={() => setActiveFilter(status ?? null)}
									className={`py-2 px-3 gap-1.5 border-border ${
										isActive
											? 'bg-surface2 border-white/12 text-text hover:bg-surface2 hover:border-white/12 cursor-default'
											: ''
									}`}
								>
									{dotColor && (
										<div className={`size-1.5 ${dotColor} rounded-full`} />
									)}
									{label}
									<div className="px-2 py-px bg-white/8 rounded-xl text-xs">
										{status ? statusCounts[status] : books.length}
									</div>
								</Button>
							)
						})}
					</div>
				</div>

				{isEmpty || isFilterEmpty ? (
					<div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
						{emptyState.icon}
						<div className="space-y-1">
							<h3 className="font-serif text-lg font-semibold">
								{emptyState.title}
							</h3>
							<p className="text-muted text-sm max-w-72">{emptyState.text}</p>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-[repeat(auto-fill,minmax(168px,1fr))] gap-5">
						{filteredBooks.map((book) => (
							<BookCard key={book.id} book={book} />
						))}
					</div>
				)}
			</div>
		</div>
	)
}
