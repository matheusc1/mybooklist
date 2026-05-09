interface LogoProps {
	className?: string
	textClassName?: string
}

export function Logo({ className, textClassName }: LogoProps) {
	return (
		<div className={`flex items-center gap-2.5 ${className || ''}`}>
			<div className="size-8 bg-accent rounded-md flex items-center justify-center">
				<span className="font-serif text-sm text-bg font-bold">M</span>
			</div>
			<p className={`text-xl font-serif font-semibold ${textClassName || ''}`}>
				MyBookList
			</p>
		</div>
	)
}
