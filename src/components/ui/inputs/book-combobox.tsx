import { Combobox } from '@base-ui/react/combobox'
import { LucideCheck, LucideChevronDown, LucideX } from 'lucide-react'
import type { Book } from '#/types/types'

interface BookComboboxProps {
	books: Book[]
	value?: Book | null
	onValueChange?: (book: Book | null) => void
	disabled?: boolean
	readOnly?: boolean
	placeholder?: string
	container?: React.RefObject<HTMLDivElement | null>
}

export function BookCombobox({
	books,
	value,
	onValueChange,
	disabled,
	readOnly,
	placeholder = 'Search books...',
	container,
}: BookComboboxProps) {
	return (
		<Combobox.Root
			items={books}
			value={value ?? null}
			onValueChange={onValueChange}
			itemToStringLabel={(book) => book?.title ?? ''}
			disabled={disabled}
			readOnly={readOnly}
			modal={false}
		>
			<Combobox.InputGroup className="relative flex w-full items-center rounded-lg border border-border bg-surface2 transition-[border-color,box-shadow] duration-150 input-focus-within">
				<Combobox.Input
					placeholder={placeholder}
					className="w-full bg-transparent py-2.5 pl-4 pr-16 text-sm outline-none placeholder:text-muted/50 disabled:text-text/70"
				/>
				<div className="absolute right-0 flex h-full items-center gap-0.5 pr-3">
					<Combobox.Clear
						keepMounted
						className="flex items-center justify-center rounded p-1 text-muted transition-colors duration-100 hover:text-text data-visible:opacity-100 opacity-0 bg-transparent border-none cursor-pointer"
						aria-label="Clear"
					>
						<LucideX className="size-3.5" />
					</Combobox.Clear>
					<Combobox.Trigger
						className="flex items-center justify-center p-1 text-muted bg-transparent border-none cursor-pointer"
						aria-label="Open"
					>
						<LucideChevronDown className="size-4 transition-transform duration-150 data-popup-open:rotate-180" />
					</Combobox.Trigger>
				</div>
			</Combobox.InputGroup>

			<Combobox.Portal container={container}>
				<Combobox.Positioner
					sideOffset={4}
					positionMethod="fixed"
					className="z-1000 outline-none"
				>
					<Combobox.Popup className="w-(--anchor-width) rounded-lg border border-white/12 bg-surface2 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
						<div className="px-3 pt-2 pb-1 font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted">
							Books
						</div>

						<Combobox.Empty className="text-center text-sm text-muted">
							<div className="px-3 py-4">No books found</div>
						</Combobox.Empty>

						<Combobox.List className="max-h-64 overflow-y-auto p-1 outline-none">
							{(book: Book) => (
								<Combobox.Item
									key={book.id}
									value={book}
									className="flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-1.5 text-sm outline-none transition-colors duration-100 data-highlighted:bg-surface3 data-selected:text-accent"
								>
									<img
										src={book.bookCover ?? '/book-cover.jpg'}
										alt=""
										className="h-11 w-7 shrink-0 rounded object-cover"
									/>

									<div className="flex min-w-0 flex-1 flex-col gap-0.5">
										<span className="truncate font-medium leading-snug">
											{book.title}
										</span>
										<span className="truncate text-xs text-muted">
											{book.author}
										</span>
									</div>

									<Combobox.ItemIndicator className="shrink-0">
										<LucideCheck className="size-4 text-accent" />
									</Combobox.ItemIndicator>
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Popup>
				</Combobox.Positioner>
			</Combobox.Portal>
		</Combobox.Root>
	)
}
