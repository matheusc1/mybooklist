import { cn } from 'tailwind-variants'

export function FieldError({
	message,
	className,
}: {
	message?: string
	className?: string
}) {
	if (!message) return null
	return <span className={cn('text-xs text-danger', className)}>{message}</span>
}
