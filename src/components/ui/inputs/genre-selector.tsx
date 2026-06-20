import * as Select from '@radix-ui/react-select'
import { LucideCheck, LucideChevronDown } from 'lucide-react'

type GenreSelectorProps = Select.SelectProps

const genres = [
	['fantasy', 'Fantasy'],
	['sci-fi', 'Sci-Fi'],
	['literary-fiction', 'Literary Fiction'],
	['mystery-thriller', 'Mystery / Thriller'],
	['romance', 'Romance'],
	['horror', 'Horror'],
	['self-help', 'Self-help'],
	['science-technology', 'Science / Technology'],
	['classics', 'Classics'],
	['short-stories', 'Short Stories'],
	['non-fiction', 'Non-fiction'],
	['biography', 'Biography'],
	['history', 'History'],
	['philosophy', 'Philosophy'],
	['manga-comics', 'Manga / Comics'],
	['other', 'Other'],
]

export function GenreSelector({ ...props }: GenreSelectorProps) {
	return (
		<Select.Root {...props}>
			<Select.Trigger
				aria-label="Genre"
				className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-surface2 px-4 py-2.5 text-sm outline-none input-focus transition-[border-color,box-shadow] duration-150 data-placeholder:text-muted disabled:disabled:text-text/70"
			>
				<Select.Value placeholder="Select a genre" />
				<Select.Icon className="text-muted">
					<LucideChevronDown className="size-4" />
				</Select.Icon>
			</Select.Trigger>

			<Select.Portal>
				<Select.Content
					position="item-aligned"
					className="z-50 overflow-hidden rounded-lg border border-border2 bg-surface2 shadow-[0_16px_40px_rgba(0,0,0,0.5)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
				>
					<Select.Viewport className="p-1">
						<Select.Group>
							<Select.Label className="px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted">
								Genres
							</Select.Label>

							{genres.map(([value, label]) => (
								<Select.Item
									key={value}
									value={value}
									className="flex cursor-pointer select-none items-center justify-between rounded-md px-3 py-2 text-sm outline-none transition-colors duration-100 data-highlighted:bg-surface3 data-[state=checked]:text-accent"
								>
									<Select.ItemText>{label}</Select.ItemText>
									<Select.ItemIndicator>
										<LucideCheck className="size-4 text-accent" />
									</Select.ItemIndicator>
								</Select.Item>
							))}
						</Select.Group>
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	)
}
