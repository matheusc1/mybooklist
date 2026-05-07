import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/books')({
	component: MyBooks,
})

function MyBooks() {
	return <div>Hello "/books"!</div>
}
