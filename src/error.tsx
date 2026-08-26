import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, button } from '@/components/ui/button'

interface ErrorComponentProps {
	error: Error
	reset?: () => void
}

export function ErrorComponent({ error, reset }: ErrorComponentProps) {
	const [showDetails, setShowDetails] = useState(false)

	return (
		<div className="min-h-screen font-sans flex flex-col">
			<div className="flex-1 relative overflow-hidden flex items-center justify-center px-6">
				<div
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-150 pointer-events-none rounded-full"
					style={{
						background:
							'radial-gradient(ellipse, color-mix(in srgb, var(--color-danger) 8%, transparent) 0%, transparent 65%)',
					}}
				/>

				<div className="relative z-10 flex flex-col items-center text-center max-w-md animate-fade-up">
					<div className="text-xs uppercase tracking-[0.14em] text-danger font-mono mb-4 opacity-85">
						Something went wrong
					</div>

					<h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-3">
						This page hit a snag.
					</h1>

					<p className="text-sm text-muted leading-relaxed max-w-sm mb-8">
						An unexpected error occurred while loading this page. You can try
						again, or head back to a page that works.
					</p>

					<div className="flex gap-3 flex-wrap justify-center">
						<Button variant="primary" size="lg" onClick={() => reset?.()}>
							Try again
						</Button>
						<Link
							to="/home"
							className={button({ variant: 'ghost', size: 'lg' })}
						>
							Back to Home
						</Link>
					</div>

					{import.meta.env.DEV && (
						<div className="mt-10 w-full">
							<button
								type="button"
								onClick={() => setShowDetails((v) => !v)}
								className="text-xxs font-mono uppercase tracking-wider text-muted hover:text-accent transition-colors cursor-pointer"
							>
								{showDetails ? 'Hide' : 'Show'} error details
							</button>

							{showDetails && (
								<div className="mt-3 text-left bg-surface border border-border rounded-lg p-4 animate-fade-in">
									<div className="text-xxs font-mono uppercase tracking-wider text-muted mb-2">
										{error.name || 'Error'}
									</div>
									<div className="text-xs font-mono text-danger/90 wrap-break-words leading-relaxed">
										{error.message}
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
