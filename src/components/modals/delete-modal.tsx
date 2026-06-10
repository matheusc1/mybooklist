import { Button } from '../ui/button'
import { Modal } from '../ui/modal'

type DeleteTarget = 'session' | 'book'

interface DeleteModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	type: DeleteTarget
	bookTitle: string
	onConfirm: () => void
}

const deleteConfig: Record<DeleteTarget, { eyebrow: string; desc: string }> = {
	session: {
		eyebrow: 'Delete session',
		desc: 'Your reading progress for this book will be updated accordingly.',
	},
	book: {
		eyebrow: 'Delete book',
		desc: 'All reading sessions and progress associated with this book will also be removed.',
	},
}

export function DeleteModal({
	open,
	onOpenChange,
	type,
	bookTitle,
	onConfirm,
}: DeleteModalProps) {
	const { eyebrow, desc } = deleteConfig[type]

	return (
		<Modal.Root size="sm" open={open} onOpenChange={onOpenChange}>
			<Modal.Header variant="delete" eyebrow={eyebrow} title={bookTitle} />

			<Modal.Body>
				<p className="text-sm text-muted">
					This action is{' '}
					<strong className="font-medium text-text/70">
						permanent and cannot be undone
					</strong>
					. {desc}
				</p>
			</Modal.Body>

			<Modal.Footer>
				<Button variant="ghost" onClick={() => onOpenChange(false)}>
					Cancel
				</Button>
				<Button variant="danger" onClick={onConfirm}>
					Delete
				</Button>
			</Modal.Footer>
		</Modal.Root>
	)
}
