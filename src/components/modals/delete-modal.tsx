import { useState } from 'react'
import { Button } from '../ui/button'
import { Modal } from '../ui/modal'

type DeleteTarget = 'session' | 'book'

interface DeleteModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	type: DeleteTarget
	bookTitle: string
	isLastSession?: boolean
	pending?: boolean
	onConfirm: (resetToPlanned: boolean) => void
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
	isLastSession,
	pending,
	onConfirm,
}: DeleteModalProps) {
	const { eyebrow, desc } = deleteConfig[type]
	const [resetToPlanned, setResetToPlanned] = useState(false)

	const showResetCheckbox = type === 'session' && isLastSession === true
	const showResetWarning = type === 'session' && isLastSession === undefined

	function handleOpenChange(next: boolean) {
		if (!next) setResetToPlanned(false)
		onOpenChange(next)
	}

	return (
		<Modal.Root size="sm" open={open} onOpenChange={handleOpenChange}>
			<Modal.Header variant="delete" eyebrow={eyebrow} title={bookTitle} />

			<Modal.Body>
				<p className="text-sm text-muted">
					This action is{' '}
					<strong className="font-medium text-text/70">
						permanent and cannot be undone
					</strong>
					. {desc}
				</p>

				{showResetCheckbox && (
					<label className="mt-4 flex items-start gap-2.5 rounded-lg border border-border bg-surface2 p-3 text-sm cursor-pointer">
						<input
							type="checkbox"
							checked={resetToPlanned}
							onChange={(e) => setResetToPlanned(e.target.checked)}
							disabled={pending}
							className="mt-0.5 size-4 accent-accent"
						/>
						<span className="text-text/80">
							Reset this book's progress back to{' '}
							<strong className="font-medium">Planned</strong>
						</span>
					</label>
				)}

				{showResetWarning && (
					<p className="mt-4 rounded-lg border border-border bg-surface2 p-3 text-xs text-muted">
						Progress reset only applies when this is the book's last remaining
						session — couldn't confirm that yet.
					</p>
				)}
			</Modal.Body>

			<Modal.Footer>
				<Button
					variant="ghost"
					onClick={() => handleOpenChange(false)}
					disabled={pending}
				>
					Cancel
				</Button>
				<Button
					variant="danger"
					onClick={() => onConfirm(resetToPlanned)}
					disabled={pending}
				>
					{pending ? 'Deleting...' : 'Delete'}
				</Button>
			</Modal.Footer>
		</Modal.Root>
	)
}
