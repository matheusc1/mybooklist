interface StatCardProps {
	value: string | number
	label: string
	textColor?: string
}

export function StatCard({ value, label, textColor }: StatCardProps) {
	return (
		<div className="bg-surface p-3 lg:p-4 space-y-1 rounded-xl border border-border">
			<p
				className={`font-serif font-bold text-xl/[1.0] lg:text-2xl/[1.0] ${textColor}`}
			>
				{value}
			</p>
			<p className="text-xs text-muted tracking-wider uppercase">{label}</p>
		</div>
	)
}
