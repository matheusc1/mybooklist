import * as RadioGroup from '@radix-ui/react-radio-group'

type BookStatusSelectorProps = RadioGroup.RadioGroupProps

const statuses = [
	{
		value: 'want',
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

export function BookStatusSelector({ ...props }: BookStatusSelectorProps) {
	return (
		<RadioGroup.Root className="flex flex-wrap gap-2" {...props}>
			{statuses.map(({ value, label, activeClass }) => (
				<RadioGroup.Item
					key={value}
					value={value}
					className={`cursor-pointer select-none rounded-full border border-border bg-surface2 px-4 py-2 text-xs font-medium text-muted outline-none transition-all duration-150 hover:border-white/12 hover:text-text data-[state=checked]:border-transparent data-[state=checked]:font-semibold data-[state=checked]:text-bg ${activeClass}`}
				>
					{label}
				</RadioGroup.Item>
			))}
		</RadioGroup.Root>
	)
}
