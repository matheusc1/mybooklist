import { LucideBookX } from 'lucide-react'
import { BackLink } from './back-link'

export function BookDetailsError() {
	return (
		<main className="mx-auto min-h-[calc(100vh-69px)] w-full max-w-275 px-5 py-6 lg:px-10 lg:py-8">
			<BackLink className="inline-block font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent" />

			<div className="flex flex-col items-center justify-center gap-3 py-20 text-center animate-fade-up">
				<LucideBookX
					aria-hidden="true"
					className="size-12 stroke-1 text-muted"
				/>
				<div className="space-y-1">
					<h1 className="font-serif text-lg font-semibold">
						We couldn't load this book
					</h1>
					<p className="text-muted text-sm max-w-72">
						It may have been removed, or something went wrong on our side.
						Refresh the page to try again.
					</p>
				</div>
			</div>
		</main>
	)
}
