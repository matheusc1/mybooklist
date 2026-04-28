import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
	component: PrivacyPolicy,
})

function PrivacyPolicy() {
	return <div>Hello "/privacy"!</div>
}
