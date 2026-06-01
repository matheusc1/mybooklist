import type { LabelHTMLAttributes } from 'react'

type FieldLabelProps = LabelHTMLAttributes<HTMLLabelElement>

export function FieldLabel({ children, ...props }: FieldLabelProps) {
	return (
		<label
			className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted"
			htmlFor={props.htmlFor}
			{...props}
		>
			{children}
		</label>
	)
}
