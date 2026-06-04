import type { ReactNode } from 'react'

interface ModalFooterProps {
	children: ReactNode
}

export function ModalFooter({ children }: ModalFooterProps) {
	return (
		<footer className="px-5 py-5 sm:px-7 flex items-center justify-end gap-3 border-t border-border">
			{children}
		</footer>
	)
}
