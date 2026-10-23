import { useForm, useSelector } from '@tanstack/react-form'
import { LucideTrash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import z from 'zod'
import { MAX_NOTES_LENGTH } from '#/constants/book'
import type { ActivityStatus } from '#/constants/book-status'
import { useCreateBook, useDeleteBook, useUpdateBook } from '#/hooks/use-books'
import type { Book, CreateBook } from '#/types/book'
import type { ModalMode } from '#/types/common'
import { getTodayDate } from '#/utils/format-date'
import { getPercent } from '#/utils/get-percent'
import { Button } from '../ui/button'
import {
	BookStatusSelector,
	FieldError,
	FieldLabel,
	GenreSelector,
	Input,
	RatingStars,
	Textarea,
} from '../ui/inputs'
import { Modal } from '../ui/modal'
import { DeleteModal } from './delete-modal'

interface BookModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	mode?: ModalMode
	book?: Book
	onDeleted?: () => void
}

const bookSchema = z
	.object({
		title: z.string().min(1, 'Title cannot be empty'),
		author: z.string().min(1, 'Author cannot be empty'),
		coverUrl: z.url({ message: 'Must be a valid URL' }).or(z.literal('')),
		genre: z.string().min(1, 'Genre cannot be empty'),
		status: z.string().min(1, 'Status cannot be empty'),
		currentPage: z.union([
			z.number().gte(0, 'Current page cannot be less than 0'),
			z.undefined(),
		]),
		totalPages: z.number().gt(0, 'Total pages cannot be less than 1'),
		rating: z.union([z.number(), z.undefined()]),
		startedAt: z.string(),
		completedAt: z.string(),
		notes: z.string(),
	})
	.refine(
		(data) =>
			data.currentPage === undefined || data.currentPage <= data.totalPages,
		{
			message: 'Current page cannot be greater than total pages',
			path: ['currentPage'],
		},
	)

const headerTitleMap: Record<ModalMode, string> = {
	add: 'Add Book',
	edit: 'Edit Book',
}

export function BookModal({
	open,
	onOpenChange,
	mode = 'add',
	book,
	onDeleted,
}: BookModalProps) {
	const [deleteOpen, setDeleteOpen] = useState(false)

	const isEdit = mode === 'edit'

	const { mutate: createBook, isPending: isCreating } = useCreateBook()
	const { mutate: updateBook, isPending: isUpdating } = useUpdateBook()
	const { mutate: deleteBook, isPending: isDeleting } = useDeleteBook()

	const form = useForm({
		defaultValues: {
			title: book?.title ?? '',
			author: book?.author ?? '',
			coverUrl: book?.coverUrl ?? '',
			genre: book?.genre ?? '',
			status: book?.status ?? '',
			currentPage: book?.currentPage ?? (undefined as number | undefined),
			totalPages: book?.totalPages ?? (undefined as number | undefined),
			rating: book?.rating ?? (undefined as number | undefined),
			startedAt: book?.startedAt ?? '',
			completedAt: book?.completedAt ?? '',
			notes: book?.notes ?? '',
		},
		validators: {
			onChange: bookSchema,
		},
		onSubmit: async ({ value }) => {
			const payload: CreateBook = {
				title: value.title,
				author: value.author,
				genre: value.genre,
				status: value.status as ActivityStatus,
				totalPages: value.totalPages as number,
				currentPage: value.currentPage,
				coverUrl: value.coverUrl || undefined,
				rating: value.rating,
				startedAt: value.startedAt || undefined,
				completedAt: value.completedAt || undefined,
				notes: value.notes,
			}

			if (!isEdit) {
				createBook(payload, { onSuccess: () => onOpenChange(false) })
				return
			}

			if (book) {
				updateBook(
					{ id: book.id, ...payload },
					{ onSuccess: () => onOpenChange(false) },
				)
			}
		},
	})

	const status = useSelector(form.store, (s) => s.values.status)
	const currentPage = useSelector(form.store, (s) => s.values.currentPage)
	const totalPages = useSelector(form.store, (s) => s.values.totalPages)
	const prevStatusRef = useRef<string | null>(null)

	const progress = getPercent(currentPage ?? 0, totalPages ?? 0)

	function handlePageChange(
		value: number,
		fieldName: 'currentPage' | 'totalPages',
	) {
		form.setFieldValue(fieldName, value)

		const current = fieldName === 'currentPage' ? value : (currentPage ?? 0)
		const total = fieldName === 'totalPages' ? value : (totalPages ?? 0)

		if (total > 0 && current >= total) {
			if (status !== 'completed') prevStatusRef.current = status
			form.setFieldValue('status', 'completed')
			form.setFieldValue('completedAt', getTodayDate())
		} else if (prevStatusRef.current !== null) {
			form.setFieldValue('status', prevStatusRef.current)
			form.setFieldValue('completedAt', '')
			prevStatusRef.current = null
		}
	}

	function handleCancel() {
		form.reset()
		onOpenChange(false)
	}

	function handleDeleteConfirm() {
		if (!book) return
		deleteBook(book.id, {
			onSuccess: () => {
				setDeleteOpen(false)
				onOpenChange(false)
				onDeleted?.()
			},
		})
	}

	return (
		<>
			<Modal.Root open={open} onOpenChange={onOpenChange}>
				<Modal.Header eyebrow="Library" title={headerTitleMap[mode]} />

				<Modal.Body>
					<form
						id="book-form"
						onSubmit={(e) => {
							e.preventDefault()
							e.stopPropagation()
							form.handleSubmit()
						}}
					>
						<fieldset className="space-y-4">
							<legend className="sr-only">Book details</legend>
							<form.Field name="title">
								{(field) => (
									<div className="flex flex-col gap-2">
										<FieldLabel htmlFor={field.name} required>
											Title
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g. The Name of the Wind"
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

							<form.Field name="author">
								{(field) => (
									<div className="flex flex-col gap-2">
										<FieldLabel htmlFor={field.name} required>
											Author
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g. Patrick Rothfuss"
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

							<form.Field name="coverUrl">
								{(field) => (
									<div className="flex flex-col gap-2">
										<FieldLabel htmlFor={field.name}>Book Cover</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g. https://covers.openlibrary.org/b/id/15143311-M.jpg"
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

							<form.Field name="genre">
								{(field) => (
									<div className="flex flex-col gap-2">
										<FieldLabel required>Genre</FieldLabel>
										<GenreSelector
											value={field.state.value}
											onValueChange={field.handleChange}
										/>
										<FieldError
											message={field.state.meta.errors[0]?.message}
											className="-mt-1"
										/>
									</div>
								)}
							</form.Field>

							<form.Field name="status">
								{(field) => (
									<div className="flex flex-col gap-2">
										<FieldLabel required>Status</FieldLabel>
										<BookStatusSelector
											value={field.state.value}
											onValueChange={field.handleChange}
											onBlur={field.handleBlur}
										/>
										<FieldError
											message={field.state.meta.errors[0]?.message}
											className="-mt-1"
										/>
									</div>
								)}
							</form.Field>

							<div className="flex gap-3">
								<form.Field name="currentPage">
									{(field) => (
										<div className="flex-1 flex flex-col gap-2">
											<FieldLabel htmlFor={field.name}>Current Page</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="number"
												value={field.state.value ?? ''}
												onBlur={field.handleBlur}
												onChange={(e) =>
													handlePageChange(
														e.target.valueAsNumber,
														'currentPage',
													)
												}
												placeholder="0"
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

								<form.Field name="totalPages">
									{(field) => (
										<div className="flex-1 flex flex-col gap-2">
											<FieldLabel htmlFor={field.name}>Total Pages</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="number"
												value={field.state.value ?? ''}
												onBlur={field.handleBlur}
												onChange={(e) =>
													handlePageChange(e.target.valueAsNumber, 'totalPages')
												}
												placeholder="e.g. 622"
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

							<div className="flex flex-col items-center justify-center gap-2 p-4 bg-surface2 rounded-lg border border-border">
								<div className="w-full flex justify-between">
									<p className="font-mono uppercase text-muted text-xs tracking-[0.08em]">
										Progress
									</p>
									<span className="font-mono font-medium text-xs text-accent">
										{progress}%
									</span>
								</div>
								<div className="w-full h-1 bg-surface3 overflow-hidden rounded-full">
									<div
										className="h-full bg-gradient-progress rounded-full transition-all duration-300"
										role="progressbar"
										aria-label="Reading progress"
										aria-valuenow={progress}
										aria-valuemin={0}
										aria-valuemax={100}
										style={{ width: `${progress}%` }}
									/>
								</div>
							</div>

							<form.Field name="rating">
								{(field) => (
									<div className="flex flex-col gap-2">
										<FieldLabel>Rating</FieldLabel>
										<RatingStars
											value={field.state.value}
											onChange={field.handleChange}
										/>
									</div>
								)}
							</form.Field>

							<div className="grid grid-cols-2 gap-3">
								<form.Field name="startedAt">
									{(field) => (
										<div className="flex flex-col gap-2">
											<FieldLabel htmlFor={field.name}>Date Started</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="date"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
											/>
										</div>
									)}
								</form.Field>

								{status === 'completed' && (
									<form.Field name="completedAt">
										{(field) => (
											<div className="flex flex-col gap-2">
												<FieldLabel htmlFor={field.name}>
													Date Completed
												</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													type="date"
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
											</div>
										)}
									</form.Field>
								)}
							</div>

							<form.Field name="notes">
								{(field) => (
									<div className="flex flex-col gap-2">
										<FieldLabel htmlFor={field.name}>Notes</FieldLabel>
										<Textarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={field.handleChange}
											maxLength={MAX_NOTES_LENGTH}
											placeholder="Thoughts, a summary, your review, or anything else you want to remember about this book..."
										/>
									</div>
								)}
							</form.Field>
						</fieldset>
					</form>
				</Modal.Body>

				<Modal.Footer>
					{isEdit && (
						<Button
							onClick={() => setDeleteOpen(true)}
							className="mr-auto"
							variant="destructive"
							size="icon"
							type="button"
							aria-label="Delete book"
							disabled={isDeleting}
						>
							<LucideTrash2 aria-hidden="true" className="size-5" />
						</Button>
					)}

					<form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
						{([canSubmit, isSubmitting]) => {
							const isPending = isCreating || isUpdating || isSubmitting
							return (
								<>
									<Button
										form="book-form"
										type="reset"
										variant="ghost"
										onClick={handleCancel}
										disabled={isPending}
									>
										Cancel
									</Button>
									<Button
										form="book-form"
										type="submit"
										disabled={!canSubmit || isPending}
									>
										{isPending ? 'Saving...' : 'Save'}
									</Button>
								</>
							)
						}}
					</form.Subscribe>
				</Modal.Footer>
			</Modal.Root>

			<DeleteModal
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
				type="book"
				bookTitle={book?.title ?? ''}
				pending={isDeleting}
				onConfirm={handleDeleteConfirm}
			/>
		</>
	)
}
