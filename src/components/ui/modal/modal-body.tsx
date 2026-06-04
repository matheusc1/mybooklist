import type { ReactNode } from 'react'

interface ModalBodyProps {
	children: ReactNode
}

export function ModalBody({ children }: ModalBodyProps) {
	return <div className="overflow-y-auto p-5 sm:px-7 sm:py-6">{children}</div>
}
