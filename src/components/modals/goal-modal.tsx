import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { useUpsertGoal } from '#/hooks/use-goal'
import { useGoalModalStore } from '@/stores/goal-store'
import { Button } from '../ui/button'
import { FieldError, FieldLabel, Input } from '../ui/inputs'
import { Modal } from '../ui/modal'

const goalSchema = z.object({
	target: z
		.number({ error: 'A reading goal is required' })
		.gt(0, 'Your goal must be at least 1 book'),
})

const year = new Date().getFullYear().toString()

export function GoalModal() {
	const { open, mode, closeModal } = useGoalModalStore()
	const { mutate: setGoal } = useUpsertGoal()

	const form = useForm({
		defaultValues: {
			target: undefined as number | undefined,
		},
		validators: {
			onChange: goalSchema,
		},
		onSubmit: async ({ value }) => {
			if (value.target === undefined) return

			setGoal({ target: value.target })
			form.reset()
			closeModal()
		},
	})

	function handleCancel() {
		form.reset()
		closeModal()
	}

	return (
		<Modal.Root open={open} onOpenChange={(v) => !v && closeModal()}>
			<Modal.Header eyebrow="Reading goal" title={year} />

			<form
				onSubmit={(e) => {
					e.preventDefault()
					e.stopPropagation()
					form.handleSubmit()
				}}
			>
				<Modal.Body>
					<form.Field name="target">
						{(field) => (
							<div className="flex flex-col gap-2">
								<FieldLabel required htmlFor={field.name}>
									Books to read
								</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value ?? ''}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.valueAsNumber)}
									type="number"
									placeholder="e.g. 12"
									aria-describedby={`${field.name}-hint${field.state.meta.errors[0] ? ` ${field.name}-error` : ''}`}
									aria-invalid={!!field.state.meta.errors[0]}
								/>
								<span
									id={`${field.name}-hint`}
									className="font-medium text-xs text-muted -mt-1"
								>
									How many books do you want to read this year?
								</span>
								<FieldError
									id={`${field.name}-error`}
									message={field.state.meta.errors[0]?.message}
									className="-mt-1"
								/>
							</div>
						)}
					</form.Field>
				</Modal.Body>

				<Modal.Footer>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<>
								<Button type="reset" variant="ghost" onClick={handleCancel}>
									Cancel
								</Button>
								<Button type="submit" disabled={!canSubmit || isSubmitting}>
									{mode === 'add' ? 'Set Goal' : 'Save'}
								</Button>
							</>
						)}
					</form.Subscribe>
				</Modal.Footer>
			</form>
		</Modal.Root>
	)
}
