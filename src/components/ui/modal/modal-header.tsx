import * as Dialog from '@radix-ui/react-dialog'
import { LucideX } from 'lucide-react'
import { Button } from '../button'

interface ModalHeaderProps {
	eyebrow: string
	title: string
	variant?: 'default' | 'delete'
}

export function ModalHeader({
	eyebrow,
	title,
	variant = 'default',
}: ModalHeaderProps) {
	return (
		<header className="flex items-center justify-between border-b border-border p-5 sm:px-7 sm:pt-6 pb-5">
			<div className="space-y-1">
				<Dialog.Description
					className={`font-mono uppercase text-xs tracking-widest ${variant === 'delete' ? 'text-danger' : 'text-accent'}`}
				>
					{eyebrow}
				</Dialog.Description>
				<Dialog.Title className="font-serif font-semibold text-xl tracking-tight">
					{title}
				</Dialog.Title>
			</div>

			<Dialog.Close asChild>
				<Button variant="icon" size="icon" aria-label="Close modal">
					<LucideX className="size-4" />
				</Button>
			</Dialog.Close>
		</header>
	)
}
