import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: LadingPage,
})

function LadingPage() {
	return (
		<div className="overflow-x-hidden min-h-dvh">
			<p>landing page</p>
		</div>
	)
}
