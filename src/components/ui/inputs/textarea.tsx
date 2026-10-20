import type { ChangeEvent, TextareaHTMLAttributes } from 'react'
import { useId } from 'react'
import { cn } from 'tailwind-variants'

interface TextareaProps
	extends Omit<
		TextareaHTMLAttributes<HTMLTextAreaElement>,
		'value' | 'onChange' | 'maxLength'
	> {
	value: string
	onChange?: (value: string) => void
	maxLength: number
}

export function Textarea({
	value,
	onChange,
	maxLength,
	className,
	'aria-describedby': describedBy,
	...props
}: TextareaProps) {
	const counterId = useId()
	const isNearLimit = value.length >= maxLength * 0.9

	function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
		onChange?.(event.target.value)
	}

	return (
		<div className="relative">
			<textarea
				{...props}
				value={value}
				onChange={handleChange}
				maxLength={maxLength}
				aria-describedby={[describedBy, counterId].filter(Boolean).join(' ')}
				className={cn(
					'input-focus min-h-56 w-full resize-y rounded-lg border border-border bg-surface2 px-4 py-2.5 pb-9 text-sm text-text outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted/50 read-only:text-text/70',
					className,
				)}
			/>
			<span
				id={counterId}
				className={`pointer-events-none absolute bottom-3 right-4 font-mono text-xxs ${
					isNearLimit ? 'text-danger' : 'text-muted'
				}`}
			>
				{value.length}/{maxLength}
			</span>
		</div>
	)
}
