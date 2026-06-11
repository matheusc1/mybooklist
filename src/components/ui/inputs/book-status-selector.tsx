import * as RadioGroup from '@radix-ui/react-radio-group'

interface BookStatusSelectorProps extends RadioGroup.RadioGroupProps {
	readOnly?: boolean
}

const statuses = [
	{
		value: 'want-to-read',
		label: 'Want to read',
		activeClass: 'data-[state=checked]:bg-mist',
	},
	{
		value: 'reading',
		label: 'Reading',
		activeClass: 'data-[state=checked]:bg-accent2',
	},
	{
		value: 'paused',
		label: 'Paused',
		activeClass: 'data-[state=checked]:bg-parchment',
	},
	{
		value: 'finished',
		label: 'Finished',
		activeClass: 'data-[state=checked]:bg-accent',
	},
	{
		value: 'abandoned',
		label: 'Abandoned',
		activeClass: 'data-[state=checked]:bg-danger',
	},
]

export function BookStatusSelector({
	readOnly,
	...props
}: BookStatusSelectorProps) {
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
