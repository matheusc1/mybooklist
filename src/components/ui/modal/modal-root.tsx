import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'

interface ModalRootProps {
	children: ReactNode
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export function ModalRoot({ children, open, onOpenChange }: ModalRootProps) {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-bg/75 backdrop-blur-xs" />
				<Dialog.Content className="max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/12 animate-slide-up rounded-2xl fixed bg-surface top-1/2 left-1/2 -translate-1/2 shadow-modal">
					{children}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
