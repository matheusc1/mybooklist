import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/books')({
	component: MyBooks,
})

function MyBooks() {
	return <div>Hello "/books"!</div>
}
