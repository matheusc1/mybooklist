import * as RadioGroup from '@radix-ui/react-radio-group'
import { BOOK_STATUS } from '#/constants/book-status'

interface BookStatusSelectorProps extends RadioGroup.RadioGroupProps {
	readOnly?: boolean
}

const statusConfig = {
	reading: {
		active: 'data-[state=checked]:bg-accent2',
		dot: 'bg-accent2',
		text: 'text-accent2',
		bg: 'bg-accent2/15',
	},
	want: {
		active: 'data-[state=checked]:bg-mist',
		dot: 'bg-mist',
		text: 'text-mist',
		bg: 'bg-mist/15',
	},
	paused: {
		active: 'data-[state=checked]:bg-parchment',
		dot: 'bg-parchment',
		text: 'text-parchment',
		bg: 'bg-parchment/15',
	},
	finished: {
		active: 'data-[state=checked]:bg-accent',
		dot: 'bg-accent',
		text: 'text-accent',
		bg: 'bg-accent/15',
	},
	abandoned: {
		active: 'data-[state=checked]:bg-danger',
		dot: 'bg-danger',
		text: 'text-danger',
		bg: 'bg-danger/15',
	},
} as const

export function BookStatusSelector({
	readOnly,
	...props
}: BookStatusSelectorProps) {
	const statuses = Object.entries(BOOK_STATUS).map(([value, { label }]) => ({
		value,
		label,
		config: statusConfig[value as keyof typeof statusConfig],
	}))

	if (readOnly) {
		const selected = statuses.find((s) => s.value === props.value)
		if (!selected) return null

		const { dot, text, bg } = selected.config

		return (
			<div
				className={`self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${bg} ${text}`}
			>
				<span
					aria-hidden="true"
					className={`size-1.5 rounded-full shrink-0 ${dot}`}
				/>
				{selected.label}
			</div>
		)
	}

	return (
		<RadioGroup.Root className="flex flex-wrap gap-2" {...props}>
			{statuses.map(({ value, label, config }) => (
				<RadioGroup.Item
					key={value}
					value={value}
					className={`select-none rounded-full border border-border bg-surface2 px-4 py-2 text-xs font-medium text-muted outline-none transition-all duration-150 data-[state=checked]:border-transparent data-[state=checked]:font-semibold data-[state=checked]:text-bg cursor-pointer hover:border-border2 hover:text-text ${config.active}`}
				>
					{label}
				</RadioGroup.Item>
			))}
		</RadioGroup.Root>
	)
}
