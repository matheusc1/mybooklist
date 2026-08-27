import { useForm } from '@tanstack/react-form'
import { LucideTrash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import z from 'zod'
import { useBooks } from '#/hooks/use-books'
import {
	useCreateReadingSession,
	useDeleteReadingSession,
	useUpdateReadingSession,
} from '#/hooks/use-reading-sessions'
import type { ModalMode } from '#/types/common'
import { getTodayDate } from '#/utils/format-date'
import { Button } from '../ui/button'
import { FieldError, FieldLabel, Input } from '../ui/inputs'
import { BookCombobox } from '../ui/inputs/book-combobox'
import { Modal } from '../ui/modal'
import { DeleteModal } from './delete-modal'

interface ReadingSessionModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	mode?: ModalMode
	session?: {
		id: string
		bookId: string
		date: string
		fromPage: number
		toPage: number
	}
}

const readingSessionSchema = z
	.object({
		bookId: z.string().min(1, 'Book is required'),
		readAt: z.string().min(1, 'Date cannot be empty'),
		fromPage: z.number({ error: 'Initial page is required' }).gte(0),
		toPage: z.number({ error: 'Final page is required' }).gt(0),
	})
	.refine((data) => data.toPage >= data.fromPage, {
		message: 'To page cannot be less than from page',
		path: ['toPage'],
	})

const headerTitleMap = {
	add: 'Add Session',
	edit: 'Edit Session',
	view: 'View Session',
} as const

export function ReadingSessionModal({
	open,
	mode = 'add',
	session,
	onOpenChange,
}: ReadingSessionModalProps) {
	const { data: books } = useBooks()
	const { mutate: createReadingSession, isPending: isCreating } =
		useCreateReadingSession()
	const { mutate: updateReadingSession, isPending: isUpdating } =
		useUpdateReadingSession()
	const { mutate: deleteReadingSession, isPending: isDeleting } =
		useDeleteReadingSession()

	const [currentMode, setCurrentMode] = useState<ModalMode>(mode)
	const [deleteOpen, setDeleteOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	const isEdit = currentMode === 'edit' && !!session
	const isView = currentMode === 'view'
	const secondaryLabel = isView ? 'Close' : 'Cancel'
	const headerTitle = headerTitleMap[currentMode]

	const form = useForm({
		defaultValues: {
			bookId: session?.bookId ?? '',
			readAt: session?.date ?? getTodayDate(),
			fromPage: session?.fromPage ?? (undefined as number | undefined),
			toPage: session?.toPage ?? (undefined as number | undefined),
		},
		validators: {
			onChange: readingSessionSchema,
		},
		onSubmit: async ({ value }) => {
			if (isEdit && session) {
				updateReadingSession(
					{
						id: session.id,
						fromPage: value.fromPage,
						toPage: value.toPage,
						readAt: value.readAt,
					},
					{ onSuccess: () => onOpenChange(false) },
				)
				return
			}

			createReadingSession(
				{
					bookId: value.bookId,
					fromPage: value.fromPage ?? 0,
					toPage: value.toPage ?? 0,
					readAt: value.readAt,
				},
				{ onSuccess: () => onOpenChange(false) },
			)
		},
	})

	function handleCancel() {
		form.reset()
		setCurrentMode(mode)
		onOpenChange(false)
	}

	function handleDeleteConfirm(resetToPlanned: boolean) {
		if (!session) return
		deleteReadingSession(
			{ id: session.id, resetToPlanned },
			{
				onSuccess: () => {
					setDeleteOpen(false)
					onOpenChange(false)
				},
			},
		)
	}

	return (
		<>
			<Modal.Root open={open} onOpenChange={onOpenChange}>
				<Modal.Header eyebrow="Reading session" title={headerTitle} />

				<form
					onSubmit={(e) => {
						e.preventDefault()
						e.stopPropagation()
						form.handleSubmit()
					}}
				>
					<Modal.Body>
						<div ref={containerRef} />
						<fieldset className="space-y-4" disabled={isView}>
							<legend className="sr-only">Session details</legend>
							<form.Field name="bookId">
								{(field) => {
									const selectedBook =
										books?.find((b) => String(b.id) === field.state.value) ??
										null

									return (
										<div className="flex flex-col gap-2">
											<FieldLabel htmlFor="book-search" required={!isView}>
												Book
											</FieldLabel>
											<BookCombobox
												books={books ?? []}
												value={selectedBook}
												onValueChange={(book) => {
													field.handleChange(book ? String(book.id) : '')
													if (book && currentMode === 'add') {
														form.setFieldValue(
															'fromPage',
															book.currentPage ?? 0,
														)
													}
												}}
												disabled={isView || isEdit}
												readOnly={isView || isEdit}
												container={containerRef}
											/>
											<FieldError
												id="bookId-error"
												message={field.state.meta.errors[0]?.message}
												className="-mt-1"
											/>
										</div>
									)
								}}
							</form.Field>

							<form.Field name="readAt">
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
											aria-describedby={
												field.state.meta.errors.length > 0
													? `${field.name}-error`
													: undefined
											}
										/>
										<FieldError
											message={field.state.meta.errors[0]?.message}
											className="-mt-1"
											id={`${field.name}-error`}
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
												aria-describedby={
													field.state.meta.errors[0]
														? `${field.name}-error`
														: undefined
												}
												aria-invalid={!!field.state.meta.errors[0]}
											/>
											<FieldError
												id={`${field.name}-error`}
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
												aria-describedby={
													field.state.meta.errors[0]
														? `${field.name}-error`
														: undefined
												}
												aria-invalid={!!field.state.meta.errors[0]}
											/>
											<FieldError
												id={`${field.name}-error`}
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
									const pagesRead = bothFilled ? toPage - fromPage : 0

									return (
										bothFilled &&
										pagesRead > 0 && (
											<div className="flex flex-col gap-2">
												<FieldLabel htmlFor="pagesRead">Pages read</FieldLabel>
												<Input
													id="pagesRead"
													name="pagesRead"
													type="text"
													value={pagesRead}
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
								aria-label="Delete session"
								disabled={isDeleting}
							>
								<LucideTrash2 aria-hidden="true" className="size-5" />
							</Button>
						)}

						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => {
								const isPending = isCreating || isUpdating || isSubmitting
								return (
									<>
										<Button
											type="reset"
											variant="ghost"
											onClick={handleCancel}
											disabled={isPending}
										>
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
											disabled={isView ? false : !canSubmit || isPending}
										>
											{isPending
												? 'Saving...'
												: currentMode === 'add'
													? 'Set Record'
													: currentMode === 'edit'
														? 'Save'
														: 'Edit'}
										</Button>
									</>
								)
							}}
						</form.Subscribe>
					</Modal.Footer>
				</form>
			</Modal.Root>

			<DeleteModal
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
				type="session"
				bookTitle={
					books?.find((b) => String(b.id) === session?.bookId)?.title ?? ''
				}
				pending={isDeleting}
				onConfirm={handleDeleteConfirm}
			/>
		</>
	)
}
