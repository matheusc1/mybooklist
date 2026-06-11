import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const button = tv({
	base: 'inline-flex items-center justify-center gap-2 font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none',

	variants: {
		variant: {
			primary:
				'text-sm bg-accent text-bg hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--color-accent)_30%,transparent)] hover:-translate-y-px hover:bg-[#d4b882]',
			ghost:
				'text-sm border border-border text-muted bg-transparent hover:text-text hover:bg-surface hover:border-white/30',
			danger:
				'text-sm bg-danger text-bg rounded-lg hover:bg-[#d4735f] hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--color-danger)_30%,transparent)] hover:-translate-y-px',
			icon: 'text-muted border border-border bg-surface2 hover:text-text hover:bg-surface3 hover:border-white/15',
			destructive:
				'text-muted border border-border bg-surface2 hover:text-danger hover:bg-danger/10 hover:border-danger/35',
			dashed:
				'border border-accent/40 text-accent text-xs font-medium transition-all hover:bg-accent/10 hover:border-accent',
		},
		size: {
			icon: 'p-2',
			sm: 'px-4 py-2',
			md: 'px-5 py-2.5',
			lg: 'px-6 py-3',
		},
		rounded: {
			default: 'rounded-lg',
			full: 'rounded-full',
		},
	},

	defaultVariants: {
		variant: 'primary',
		size: 'md',
		rounded: 'default',
	},
})

type ButtonVariants = VariantProps<typeof button>

interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		ButtonVariants {
	leftIcon?: ReactNode
	rightIcon?: ReactNode
}

export function Button({
	variant,
	size,
	rounded,
	leftIcon,
	rightIcon,
	className,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			type="button"
			className={button({ variant, size, rounded, className })}
			{...props}
		>
			{leftIcon}
			{children}
			{rightIcon}
		</button>
	)
}
