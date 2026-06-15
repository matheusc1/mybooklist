import * as RadioGroup from '@radix-ui/react-radio-group'
import { BOOK_STATUS } from '#/constants/book-status'

interface BookStatusSelectorProps extends RadioGroup.RadioGroupProps {
	readOnly?: boolean
}

const activeClasses = {
	reading: 'data-[state=checked]:bg-accent2',
	want: 'data-[state=checked]:bg-mist',
	paused: 'data-[state=checked]:bg-parchment',
	finished: 'data-[state=checked]:bg-accent',
	abandoned: 'data-[state=checked]:bg-danger',
} as const

export function BookStatusSelector({
	readOnly,
	...props
}: BookStatusSelectorProps) {
	const statuses = Object.entries(BOOK_STATUS).map(([value, { label }]) => ({
		value,
		label,
		activeClass: activeClasses[value as keyof typeof activeClasses],
	}))

	const visibleStatuses = readOnly
		? statuses.filter((s) => s.value === props.value)
		: statuses

	return (
		<RadioGroup.Root className="flex flex-wrap gap-2" {...props}>
			{visibleStatuses.map(({ value, label, activeClass }) => (
				<RadioGroup.Item
					key={value}
					value={value}
					className={`select-none rounded-full border border-border bg-surface2 px-4 py-2 text-xs font-medium text-muted outline-none transition-all duration-150 data-[state=checked]:border-transparent data-[state=checked]:font-semibold data-[state=checked]:text-bg ${activeClass} ${
						readOnly
							? 'cursor-default pointer-events-none'
							: 'cursor-pointer hover:border-white/12 hover:text-text'
					}`}
				>
					{label}
				</RadioGroup.Item>
			))}
		</RadioGroup.Root>
	)
}
