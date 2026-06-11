import { useForm } from '@tanstack/react-form'
import { useStore } from '@tanstack/react-store'
import { LucideTrash2 } from 'lucide-react'
import { useState } from 'react'
import z from 'zod'
import type { Book, Mode } from '#/types/types'
import { getPercent } from '#/utils/get-percent'
import { Button } from '../ui/button'
import {
	BookStatusSelector,
	FieldError,
	FieldLabel,
	GenreSelector,
	Input,
	RatingStars,
} from '../ui/inputs'
import { Modal } from '../ui/modal'
import { DeleteModal } from './delete-modal'

type BookModalProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	mode?: Mode
	book?: Book
}

const bookSchema = z.object({
	title: z.string().min(1, 'Title cannot be empty'),
	author: z.string().min(1, 'Author cannot be empty'),
	bookCover: z.url({ message: 'Must be a valid URL' }).or(z.literal('')),
	genre: z.string().min(1, 'Genre cannot be empty'),
	status: z.string().min(1, 'Status cannot be empty'),
	currentPage: z.union([
		z.number().gte(0, 'Current page cannot be less than 0'),
		z.undefined(),
	]),
	totalPages: z.union([
		z.number().gt(0, 'Total pages cannot be less than 1'),
		z.undefined(),
	]),
	rating: z.union([z.number(), z.undefined()]),
	dateStarted: z.string(),
	dateFinished: z.string(),
})

const headerTitleMap = {
	add: 'Add Book',
	edit: 'Edit Book',
	view: 'Book Details',
} as const

export function BookModal({
	open,
	onOpenChange,
	mode = 'add',
	book,
}: BookModalProps) {
	const [currentMode, setCurrentMode] = useState<Mode>(mode)
	const [deleteOpen, setDeleteOpen] = useState(false)

	const isView = currentMode === 'view'
	const secondaryLabel = isView ? 'Close' : 'Cancel'

	const form = useForm({
		defaultValues: {
			title: book?.title ?? '',
			author: book?.author ?? '',
			bookCover: book?.bookCover ?? '',
			genre: book?.genre ?? '',
			status: book?.status ?? '',
			currentPage: book?.currentPage ?? (undefined as number | undefined),
			totalPages: book?.totalPages ?? (undefined as number | undefined),
			rating: book?.rating ?? (undefined as number | undefined),
			dateStarted: book?.startDate ?? '',
			dateFinished: book?.endDate ?? '',
		},
		validators: {
			onChange: bookSchema,
		},
		onSubmit: async ({ value }) => {
			console.log(value)
			onOpenChange(false)
		},
	})

	const status = useStore(form.store, (s) => s.values.status)
	const currentPage = useStore(form.store, (s) => s.values.currentPage)
	const totalPages = useStore(form.store, (s) => s.values.totalPages)

	const progress = getPercent(currentPage ?? 0, totalPages ?? 0)

	const headerTitle = headerTitleMap[currentMode]

	function handlePageChange(
		value: number,
		fieldName: 'currentPage' | 'totalPages',
	) {
		form.setFieldValue(fieldName, value)

		const current = fieldName === 'currentPage' ? value : (currentPage ?? 0)
		const total = fieldName === 'totalPages' ? value : (totalPages ?? 0)

		if (total > 0 && current >= total) {
			form.setFieldValue('status', 'finished')
			const today = new Date().toISOString().split('T')[0]
			form.setFieldValue('dateFinished', today)
		}
	}

	function handleCancel() {
		form.reset()
		setCurrentMode(mode)
		onOpenChange(false)
	}

	return (
		<>
			<Modal.Root open={open} onOpenChange={onOpenChange}>
				<Modal.Header eyebrow="Library" title={headerTitle} />

				<Modal.Body>
					<form
						id="book-form"
						onSubmit={(e) => {
							e.preventDefault()
							e.stopPropagation()
							form.handleSubmit()
						}}
					>
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

							<form.Field name="author">
								{(field) => (
									<div className="flex flex-col gap-2">
										<FieldLabel htmlFor={field.name} required={!isView}>
											Author
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g. Patrick Rothfuss"
											readOnly={isView}
										/>
										<FieldError
											message={field.state.meta.errors[0]?.message}
											className="-mt-1"
										/>
									</div>
								)}
							</form.Field>

							<form.Field name="bookCover">
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
											readOnly={isView}
										/>
										<FieldError
											message={field.state.meta.errors[0]?.message}
											className="-mt-1"
										/>
									</div>
								)}
							</form.Field>

							<form.Field name="genre">
								{(field) => (
									<div className="flex flex-col gap-2">
										<FieldLabel required={!isView}>Genre</FieldLabel>
										<GenreSelector
											value={field.state.value}
											onValueChange={field.handleChange}
											disabled={isView}
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
										<FieldLabel required={!isView}>Status</FieldLabel>
										<BookStatusSelector
											value={field.state.value}
											onValueChange={field.handleChange}
											onBlur={field.handleBlur}
											disabled={isView}
											readOnly={isView}
										/>
										<FieldError
											message={field.state.meta.errors[0]?.message}
											className="-mt-1"
										/>
									</div>
								)}
							</form.Field>

							{!(isView && status === 'finished') && (
								<div className="flex gap-3">
									<form.Field name="currentPage">
										{(field) => (
											<div className="flex-1 flex flex-col gap-2">
												<FieldLabel htmlFor={field.name}>
													Current Page
												</FieldLabel>
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
													readOnly={isView}
												/>
												<FieldError
													message={field.state.meta.errors[0]?.message}
													className="-mt-1"
												/>
											</div>
										)}
									</form.Field>

									<form.Field name="totalPages">
										{(field) => (
											<div className="flex-1 flex flex-col gap-2">
												<FieldLabel htmlFor={field.name}>
													Total Pages
												</FieldLabel>
												<Input
													id={field.name}
													name={field.name}
													type="number"
													value={field.state.value ?? ''}
													onBlur={field.handleBlur}
													onChange={(e) =>
														handlePageChange(
															e.target.valueAsNumber,
															'totalPages',
														)
													}
													placeholder="e.g. 622"
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
							)}

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
											disabled={isView}
										/>
									</div>
								)}
							</form.Field>

							<div className="grid grid-cols-2 gap-3">
								<form.Field name="dateStarted">
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
												readOnly={isView}
											/>
										</div>
									)}
								</form.Field>

								{status === 'finished' && (
									<form.Field name="dateFinished">
										{(field) => (
											<div className="flex flex-col gap-2">
												<FieldLabel htmlFor={field.name}>
													Date Finished
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
								)}
							</div>
						</fieldset>
					</form>
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

					<form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
						{([canSubmit, isSubmitting]) => (
							<>
								<Button
									form="book-form"
									type="reset"
									variant="ghost"
									onClick={handleCancel}
								>
									{secondaryLabel}
								</Button>
								{isView ? (
									<Button
										key="edit"
										type="button"
										onClick={() => setCurrentMode('edit')}
									>
										Edit Book
									</Button>
								) : (
									<Button
										key="save"
										form="book-form"
										type="submit"
										disabled={!canSubmit || isSubmitting}
									>
										Save
									</Button>
								)}
							</>
						)}
					</form.Subscribe>
				</Modal.Footer>
			</Modal.Root>

			<DeleteModal
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
				type="book"
				bookTitle={book?.title ?? ''}
				onConfirm={() => {}}
			/>
		</>
	)
}
