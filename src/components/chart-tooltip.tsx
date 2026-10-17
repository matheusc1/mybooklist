interface ChartTooltipProps {
	children: React.ReactNode
}

export function ChartTooltip({ children }: ChartTooltipProps) {
	return (
		<span className="chart-tooltip shadow-dropdown" aria-hidden="true">
			{children}
		</span>
	)
}
