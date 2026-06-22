import { cn } from 'tailwind-variants'

export function FieldError({
	message,
	className,
	id,
}: {
	message?: string
	className?: string
	id?: string
}) {
	if (!message) return null
	return (
		<span id={id} className={cn('text-xs text-danger', className)}>
			{message}
		</span>
	)
}
