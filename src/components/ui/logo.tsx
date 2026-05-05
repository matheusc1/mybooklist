interface LogoProps {
	className?: string
}

export function Logo({ className }: LogoProps) {
	return (
		<div className={`flex items-center gap-2.5 ${className || ''}`}>
			<div className="size-8 bg-accent rounded-md flex items-center justify-center">
				<span className="font-serif text-sm text-bg font-bold">M</span>
			</div>
			<p className="font-serif font-semibold ">MyBookList</p>
		</div>
	)
}
