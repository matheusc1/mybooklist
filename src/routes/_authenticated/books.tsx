import { createFileRoute } from '@tanstack/react-router'
import {
	LucideLibrary,
	LucidePlus,
	LucideSearch,
	LucideSearchX,
	LucideX,
} from 'lucide-react'
import { useState } from 'react'
import { BookCard } from '#/components/book-card'
import { BookModal } from '#/components/modals/book-modal'
import { Button } from '#/components/ui/button'
import type { ActivityStatus } from '#/constants/book-status'
import { BOOK_STATUS } from '#/constants/book-status'
import { books } from '#/mocks/books'
import type { Book, Mode } from '#/types/types'

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
	{
		label: 'All',
		status: null,
		color: null,
		activeColor: null,
	},
	{
		label: BOOK_STATUS.reading.label,
		status: 'reading',
		color: 'bg-accent2/50',
		activeColor: BOOK_STATUS.reading.color,
	},
	{
		label: BOOK_STATUS.want.label,
		status: 'want',
		color: 'bg-mist/50',
		activeColor: BOOK_STATUS.want.color,
	},
	{
		label: BOOK_STATUS.finished.label,
		status: 'finished',
		color: 'bg-accent/50',
		activeColor: BOOK_STATUS.finished.color,
	},
	{
		label: BOOK_STATUS.paused.label,
		status: 'paused',
		color: 'bg-parchment/50',
		activeColor: BOOK_STATUS.paused.color,
	},
	{
		label: BOOK_STATUS.abandoned.label,
		status: 'abandoned',
		color: 'bg-danger/50',
		activeColor: BOOK_STATUS.abandoned.color,
	},
]

function MyBooks() {
	const [activeFilter, setActiveFilter] = useState<ActivityStatus | null>(null) // null = All
	const [search, setSearch] = useState('')
	const [bookModal, setBookModal] = useState<{
		book?: Book
		mode: Mode
	} | null>(null)

	const statusCounts = books.reduce(
		(acc, book) => {
			acc[book.status] = (acc[book.status] ?? 0) + 1
			return acc
		},
		{} as Record<ActivityStatus, number>,
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
				icon: <LucideSearchX className="size-12 text-muted" />,
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

				<Button onClick={() => setBookModal({ mode: 'add' })}>
					<LucidePlus className="size-3" />
					Add Book
				</Button>
			</div>

			<div className="space-y-8 animate-fade-up [animation-delay:0.1s]">
				<div className="flex items-center gap-3 flex-wrap">
					<div className="relative flex-1 max-w-75 min-w-50">
						<LucideSearch className="absolute size-4 left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
						<input
							type="text"
							placeholder="Search by title or author..."
							aria-label="Search by title or author"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Escape') {
									setSearch('')
								}
							}}
							className="w-full text-sm bg-surface border border-border py-2.5 pl-10 pr-10 rounded-lg placeholder:text-muted/55 outline-none input-focus"
						/>
						{search && (
							<button
								type="button"
								aria-label="Clear search"
								onClick={() => setSearch('')}
								className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted hover:text-text hover:bg-surface2 transition-colors"
							>
								<LucideX className="size-3.5" />
							</button>
						)}
					</div>

					<div className="flex flex-wrap items-center justify-start gap-1">
						{filters.map(({ label, status, color, activeColor }) => {
							const isActive = activeFilter === status
							const dotColor = isActive ? activeColor : color

							return (
								<Button
									key={label}
									variant="ghost"
									onClick={() => setActiveFilter(status)}
									aria-pressed={isActive}
									className={`py-2 px-3 gap-1.5 border-border ${
										isActive
											? 'bg-surface2 border-border2 text-text hover:bg-surface2 hover:border-border2 cursor-default'
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
					<div className="flex flex-col items-center justify-center gap-3 py-20 text-center animate-fade-up">
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
							<BookCard
								key={book.id}
								book={book}
								onClick={() => setBookModal({ book, mode: 'view' })}
							/>
						))}
					</div>
				)}
			</div>

			{bookModal && (
				<BookModal
					key={bookModal.book?.id ?? 'add'}
					open={!!bookModal}
					onOpenChange={(v) => !v && setBookModal(null)}
					mode={bookModal.mode}
					book={bookModal.book}
				/>
			)}
		</div>
	)
}
