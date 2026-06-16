import { useForm } from '@tanstack/react-form'
import { LucideTrash2 } from 'lucide-react'
import { useState } from 'react'
import z from 'zod'
import type { ActivityResponse, Mode } from '#/types/types'
import { Button } from '../ui/button'
import { FieldError, FieldLabel, Input } from '../ui/inputs'
import { Modal } from '../ui/modal'
import { DeleteModal } from './delete-modal'

type Session = ActivityResponse['calendar'][number]['sessions'][number]

type ActivityModalProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	mode?: Mode
	session?: { date: string } & Session
}

const activitySchema = z.object({
	title: z.string().min(1, 'Title cannot be empty'),
	date: z.string().min(1, 'Date cannot be empty'),
	fromPage: z.number({ error: 'Initial page is required' }).gte(0),
	toPage: z.number({ error: 'Final page is required' }).gt(0),
})

const headerTitleMap = {
	add: 'Add Session',
	edit: 'Edit Session',
	view: 'View Session',
} as const

export function ActivityModal({
	open,
	mode = 'add',
	session,
	onOpenChange,
}: ActivityModalProps) {
	const [currentMode, setCurrentMode] = useState<Mode>(mode)
	const [deleteOpen, setDeleteOpen] = useState(false)

	const form = useForm({
		defaultValues: {
			title: session?.title ?? '',
			date: session?.date ?? new Date().toISOString().split('T')[0],
			fromPage: session?.fromPage ?? (undefined as number | undefined),
			toPage: session?.toPage ?? (undefined as number | undefined),
		},
		validators: {
			onChange: activitySchema,
		},
		onSubmit: async ({ value }) => {
			console.log(value)
			onOpenChange(false)
		},
	})

	const isView = currentMode === 'view'
	const secondaryLabel = isView ? 'Close' : 'Cancel'
	const headerTitle = headerTitleMap[currentMode]

	function handleCancel() {
		form.reset()
		setCurrentMode(mode)
		onOpenChange(false)
	}

	return (
		<>
			<Modal.Root open={open} onOpenChange={onOpenChange}>
				<Modal.Header eyebrow="Activity" title={headerTitle} />

				<form
					onSubmit={(e) => {
						e.preventDefault()
						e.stopPropagation()
						form.handleSubmit()
					}}
				>
					<Modal.Body>
						<fieldset className="space-y-4" disabled={isView}>
							<form.Field name="title">
								{(field) => (
									<div className="flex flex-col gap-2">
										<FieldLabel htmlFor={field.name} required={!isView}>
											Title
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g. The Name of the Wind"
											readOnly={isView}
										/>
										<FieldError
											message={field.state.meta.errors[0]?.message}
											className="-mt-1"
										/>
									</div>
								)}
							</form.Field>
							<form.Field name="date">
								{(field) => (
									<div className="flex flex-col gap-2">
										<FieldLabel htmlFor={field.name} required={!isView}>
											Date
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											type="date"
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											readOnly={isView}
										/>
									</div>
								)}
							</form.Field>
							<div className="flex gap-3">
								<form.Field name="fromPage">
									{(field) => (
										<div className="flex-1 flex flex-col gap-2">
											<FieldLabel htmlFor={field.name} required={!isView}>
												From page
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="number"
												value={field.state.value ?? ''}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(e.target.valueAsNumber)
												}
												placeholder="0"
												readOnly={isView}
											/>
											<FieldError
												message={field.state.meta.errors[0]?.message}
												className="-mt-1"
											/>
										</div>
									)}
								</form.Field>

								<form.Field name="toPage">
									{(field) => (
										<div className="flex-1 flex flex-col gap-2">
											<FieldLabel htmlFor={field.name} required={!isView}>
												To page
											</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="number"
												value={field.state.value ?? ''}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(e.target.valueAsNumber)
												}
												placeholder="e.g. 22"
												readOnly={isView}
											/>
											<FieldError
												message={field.state.meta.errors[0]?.message}
												className="-mt-1"
											/>
										</div>
									)}
								</form.Field>
							</div>

							<form.Subscribe
								selector={(state) => [
									state.values.fromPage,
									state.values.toPage,
								]}
							>
								{([fromPage, toPage]) => {
									const bothFilled = fromPage != null && toPage != null
									const totalPages = bothFilled ? toPage - fromPage : 0

									return (
										bothFilled &&
										totalPages > 0 && (
											<div className="flex flex-col gap-2">
												<FieldLabel htmlFor="totalPages">Pages read</FieldLabel>
												<Input
													id="totalPages"
													name="totalPages"
													type="text"
													value={totalPages}
													readOnly
												/>
											</div>
										)
									)
								}}
							</form.Subscribe>
						</fieldset>
					</Modal.Body>

					<Modal.Footer>
						{isView && (
							<Button
								onClick={() => setDeleteOpen(true)}
								className="mr-auto"
								variant="destructive"
								size="icon"
								type="button"
							>
								<LucideTrash2 className="size-5" />
							</Button>
						)}

						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<>
									<Button type="reset" variant="ghost" onClick={handleCancel}>
										{secondaryLabel}
									</Button>
									<Button
										type="button"
										onClick={() => {
											if (isView) {
												setCurrentMode('edit')
											} else {
												form.handleSubmit()
											}
										}}
										disabled={isView ? false : !canSubmit || isSubmitting}
									>
										{currentMode === 'add'
											? 'Set Record'
											: currentMode === 'edit'
												? 'Save'
												: 'Edit'}
									</Button>
								</>
							)}
						</form.Subscribe>
					</Modal.Footer>
				</form>
			</Modal.Root>

			<DeleteModal
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
				type="session"
				bookTitle={session?.title ?? ''}
				onConfirm={() => {}}
			/>
		</>
	)
}
