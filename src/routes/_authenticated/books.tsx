import { createFileRoute } from '@tanstack/react-router'
import { LucidePlus } from 'lucide-react'
import { BookCard } from '#/components/book-card'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/_authenticated/books')({
	component: MyBooks,
})

const books = [
	{
		id: 1,
		title: 'The Hobbit',
		author: 'J.R.R. Tolkien',
		genre: 'Fantasy',
		status: 'reading' as const,
		progress: 58,
		rating: 0,
		bookCover: 'https://m.media-amazon.com/images/I/81mCE+uclxL._SL1500_.jpg',
	},
	{
		id: 2,
		title: 'Crime and Punishment',
		author: 'Fyodor Dostoevsky',
		genre: 'Literary Fiction',
		status: 'reading' as const,
		progress: 32,
		rating: 0,
		bookCover: 'https://m.media-amazon.com/images/I/91Y6iPqpi2L._SL1500_.jpg',
	},
	{
		id: 3,
		title: 'The Final Empire',
		author: 'Brandon Sanderson',
		genre: 'Fantasy',
		status: 'finished' as const,
		progress: 100,
		rating: 4,
		bookCover: 'https://m.media-amazon.com/images/I/81NGmugxgSL._SL1500_.jpg',
	},
	{
		id: 4,
		title: 'Brave New World',
		author: 'Aldous Huxley',
		genre: 'Sci-Fi',
		status: 'finished' as const,
		progress: 100,
		rating: 5,
		bookCover: 'https://m.media-amazon.com/images/I/618lb8MnrhL._SL1500_.jpg',
	},
	{
		id: 5,
		title: '1984',
		author: 'George Orwell',
		genre: 'Literary Fiction',
		status: 'finished' as const,
		progress: 100,
		rating: 5,
		bookCover: 'https://m.media-amazon.com/images/I/715WdnBHqYL._SL1500_.jpg',
	},
	{
		id: 6,
		title: 'Dune',
		author: 'Frank Herbert',
		genre: 'Sci-Fi',
		status: 'want-to-read' as const,
		progress: 0,
		rating: 0,
		bookCover: 'https://m.media-amazon.com/images/I/913padSawdL._SL1500_.jpg',
	},
	{
		id: 7,
		title: 'The Way of Kings',
		author: 'Brandon Sanderson',
		genre: 'Fantasy',
		status: 'want-to-read' as const,
		progress: 0,
		rating: 0,
		bookCover: 'https://m.media-amazon.com/images/I/81cO02Zz6VL._SL1500_.jpg',
	},
	{
		id: 8,
		title: 'Sapiens',
		author: 'Yuval Noah Harari',
		genre: 'Non-fiction',
		status: 'finished' as const,
		progress: 100,
		rating: 4,
		bookCover: 'https://m.media-amazon.com/images/I/71ZR6hn+GbL._SL1500_.jpg',
	},
	{
		id: 9,
		title: 'The Brothers Karamazov',
		author: 'Fyodor Dostoevsky',
		genre: 'Literary Fiction',
		status: 'paused' as const,
		progress: 21,
		rating: 0,
		bookCover: 'https://m.media-amazon.com/images/I/81IE8AwMvqL._SL1500_.jpg',
	},
	{
		id: 10,
		title: 'Neuromancer',
		author: 'William Gibson',
		genre: 'Sci-Fi',
		status: 'abandoned' as const,
		progress: 18,
		rating: 2,
		bookCover: 'https://m.media-amazon.com/images/I/81XaGC5vEQL._SL1500_.jpg',
	},
	{
		id: 11,
		title: 'Atomic Habits',
		author: 'James Clear',
		genre: 'Non-fiction',
		status: 'finished' as const,
		progress: 100,
		rating: 4,
		bookCover: 'https://m.media-amazon.com/images/I/81kg51XRc1L._SL1500_.jpg',
	},
	{
		id: 12,
		title: 'The Name of the Wind',
		author: 'Patrick Rothfuss',
		genre: 'Fantasy',
		status: 'want-to-read' as const,
		progress: 0,
		rating: 0,
		bookCover: 'https://m.media-amazon.com/images/I/91kBQf9rfqL._SL1500_.jpg',
	},
	{
		id: 13,
		title: 'East of Eden',
		author: 'John Steinbeck',
		genre: 'Literary Fiction',
		status: 'finished' as const,
		progress: 100,
		rating: 5,
		bookCover: 'https://m.media-amazon.com/images/I/91jAiO8KNAL._SL1500_.jpg',
	},
	{
		id: 14,
		title: 'Project Hail Mary',
		author: 'Andy Weir',
		genre: 'Sci-Fi',
		status: 'want-to-read' as const,
		progress: 0,
		rating: 0,
		bookCover: 'https://m.media-amazon.com/images/I/81mpYNTj6SL._SL1500_.jpg',
	},
]

function MyBooks() {
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
				<div className="flex items-center gap-3 flex-wrap">
					<span>input</span>
					<div className="space-x-1">
						<span>filters</span>
						<span>tabs</span>
					</div>
				</div>

				<div className="grid grid-cols-[repeat(auto-fill,minmax(168px,1fr))] gap-5">
					{books.map((book) => (
						<BookCard key={book.id} book={book} />
					))}
				</div>
			</div>
		</div>
	)
}
