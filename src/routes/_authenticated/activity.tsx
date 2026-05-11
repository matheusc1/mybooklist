import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/activity')({
	component: Activity,
})

function Activity() {
	return <div>Hello "/activity"!</div>
}
