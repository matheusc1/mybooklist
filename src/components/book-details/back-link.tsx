import { Link, useCanGoBack, useRouter } from '@tanstack/react-router'

interface BackLinkProps {
	className?: string
}

export function BackLink({ className }: BackLinkProps) {
	const router = useRouter()
	const canGoBack = useCanGoBack()

	return (
		<Link
			to="/books"
			className={className}
			onClick={(event) => {
				if (!canGoBack) return
				event.preventDefault()
				router.history.back()
			}}
		>
			← Back
		</Link>
	)
}
