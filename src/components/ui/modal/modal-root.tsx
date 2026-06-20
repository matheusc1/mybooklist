import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const modalContent = tv({
	base: 'w-[calc(100%-2rem)] max-h-[90vh] overflow-hidden flex flex-col border border-border2 animate-slide-up rounded-2xl fixed bg-surface top-1/2 left-1/2 -translate-1/2 shadow-modal z-20',
	variants: {
		size: {
			sm: 'max-w-105',
			md: 'max-w-120',
			lg: 'max-w-xl',
		},
	},
	defaultVariants: {
		size: 'lg',
	},
})

interface ModalRootProps extends VariantProps<typeof modalContent> {
	children: ReactNode
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export function ModalRoot({
	children,
	open,
	onOpenChange,
	size,
}: ModalRootProps) {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-bg/75 backdrop-blur-xs" />
				<Dialog.Content className={modalContent({ size })}>
					{children}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
