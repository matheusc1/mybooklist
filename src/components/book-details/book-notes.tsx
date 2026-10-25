import { Textarea } from '#/components/ui/inputs'
import { MAX_NOTES_LENGTH } from '#/constants/book'

interface BookNotesProps {
	notes: string | null
	className?: string
}

export function BookNotes({ notes, className = '' }: BookNotesProps) {
	return (
		<aside
			className={`min-w-0 animate-fade-up motion-reduce:animate-none lg:sticky lg:top-24 ${className}`}
		>
			<div className="mb-4 flex items-baseline justify-between">
				<h2 className="font-serif text-xl font-semibold tracking-tight">
					Notes
				</h2>
				<span className="font-mono text-[10px] text-muted">Private</span>
			</div>

			<Textarea
				value={notes ?? ''}
				maxLength={MAX_NOTES_LENGTH}
				readOnly
				aria-label="Book notes"
				placeholder="No notes yet. Use Edit book to add some."
				className="min-h-56 resize-y text-sm leading-relaxed"
			/>
		</aside>
	)
}
