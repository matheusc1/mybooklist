import { Link } from '@tanstack/react-router'
import { LucideArrowLeft, LucideArrowRight } from 'lucide-react'

interface YearSwitcherProps {
	year: number
	isCurrentYear: boolean
}

export function YearSwitcher({ year, isCurrentYear }: YearSwitcherProps) {
	return (
		<nav aria-label="Change year" className="flex items-center gap-5">
			<Link
				to="/yearly/$year"
				params={{ year: year - 1 }}
				aria-label={'Previous year'}
				className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:bg-surface2 hover:text-text"
			>
				<LucideArrowLeft aria-hidden="true" className="size-4 " />
			</Link>
			<span
				aria-live="polite"
				className="text-center font-serif text-2xl font-bold"
			>
				{year}
			</span>
			<Link
				to="/yearly/$year"
				params={{ year: year + 1 }}
				aria-label={'Next year'}
				className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:bg-surface2 hover:text-text aria-disabled:pointer-events-none aria-disabled:opacity-50"
				disabled={isCurrentYear}
			>
				<LucideArrowRight aria-hidden="true" className="size-4" />
			</Link>
		</nav>
	)
}
