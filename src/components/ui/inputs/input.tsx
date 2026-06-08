import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ ...props }: InputProps) {
	return (
		<input
			className="w-full text-sm bg-surface2 border border-border px-4 py-2.5 rounded-lg placeholder:text-muted/50 outline-none input-focus transition-[border-color,box-shadow] duration-150 disabled:text-muted"
			autoComplete="off"
			{...props}
		/>
	)
}
