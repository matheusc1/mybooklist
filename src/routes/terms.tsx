import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
	component: TermsOfService,
})

function TermsOfService() {
	return <div>Hello "/terms"!</div>
}
