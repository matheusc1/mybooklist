import type { LabelHTMLAttributes } from 'react'

interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
	required?: boolean
}

export function FieldLabel({ children, required, ...props }: FieldLabelProps) {
	return (
		<label
			className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted"
			htmlFor={props.htmlFor}
			{...props}
		>
			{children}
			{required && (
				<sup className="ml-1 text-danger" aria-hidden="true">
					*
				</sup>
			)}
		</label>
	)
}
