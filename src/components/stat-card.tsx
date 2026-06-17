interface StatCardProps {
	value?: string | number
	label: string
	textColor?: string
	isEmpty?: boolean
}

export function StatCard({ value, label, textColor, isEmpty }: StatCardProps) {
	return (
		<div className="bg-surface p-3 lg:p-4 space-y-1 rounded-xl border border-border">
			<p
				className={`font-serif lining-nums font-bold text-lg/[1.0] lg:text-xl/[1.0] ${isEmpty ? 'text-white/15' : textColor}`}
			>
				{isEmpty ? '--' : value}
			</p>
			<p className="text-xs text-muted tracking-wider uppercase">{label}</p>
		</div>
	)
}
