import { useState } from 'react'
import { Button } from '../ui/button'
import { FieldLabel, Input } from '../ui/inputs'
import { Modal } from '../ui/modal'

type GoalModalMode = 'add' | 'view' | 'edit'

export function GoalModal() {
	const year = new Date().getFullYear().toString()
	const [open, setOpen] = useState(false)
	const [mode, setMode] = useState<GoalModalMode>('view')

	return (
		<Modal.Root open={open} onOpenChange={setOpen}>
			<Modal.Header eyebrow="Reading goal" title={year} />

			<Modal.Body>
				<fieldset className="flex flex-col gap-2">
					<FieldLabel htmlFor="goal">Books to read</FieldLabel>
					<Input id="goal" placeholder="e.g. 12" disabled={mode === 'view'} />
					<span className="font-medium text-xs text-muted -mt-1">
						How many books do you want to read this year?
					</span>
				</fieldset>
			</Modal.Body>

			<Modal.Footer>
				{mode === 'view' && (
					<>
						<Button variant="ghost" onClick={() => setOpen(false)}>
							Close
						</Button>
						<Button onClick={() => setMode('edit')}>Edit</Button>
					</>
				)}
				{mode === 'add' && (
					<>
						<Button variant="ghost" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button onClick={() => setOpen(false)}>Set Goal</Button>
					</>
				)}
				{mode === 'edit' && (
					<>
						<Button variant="ghost" onClick={() => setMode('view')}>
							Cancel
						</Button>
						<Button onClick={() => setOpen(false)}>Save</Button>
					</>
				)}
			</Modal.Footer>
		</Modal.Root>
	)
}
