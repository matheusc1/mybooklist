import { Link } from '@tanstack/react-router'
import { LucideArrowLeft } from 'lucide-react'
import { button } from '#/components/ui/button'
import { Logo } from '#/components/ui/logo'

const links = [
	{ label: 'Home', to: '/' },
	{ label: 'My Books', to: '/books' },
	{ label: 'Activity', to: '/activity' },
]

export function NotFound() {
	return (
		<div className="h-dvh overflow-hidden flex flex-col">
			<header className="flex h-17 px-5 sm:px-10">
				<Logo />
			</header>
			<div className="w-full h-px bg-border" />

			<main className="relative flex-1 flex items-center justify-center overflow-hidden px-5 sm:px-0 animate-fade-up [animation-delay:0.1s]">
				<div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[radial-gradient(ellipse,rgba(200,169,110,0.07)_0%,transparent_65%)] pointer-events-none" />
				<p className="absolute font-serif font-bold italic text-[clamp(160px,22vw,280px)] text-white/2.5 tracking-[-0.04em] select-none pointer-events-none leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
					404
				</p>

				<div className="flex flex-col items-center text-center">
					<span className="font-mono uppercase text-accent text-xs tracking-[0.14em] mb-4">
						Error 404
					</span>
					<h1 className="font-serif font-bold tracking-tight text-2xl/loose lg:text-4xl/loose mb-3">
						This page doesn't exist — yet.
					</h1>
					<p className="text-sm/[1.7] text-muted max-w-85 mb-9">
						Looks like you wandered off the map. The page you're looking for was
						never written, or maybe it was moved to a different shelf.
					</p>

					<div className="flex gap-3 items-center">
						<Link to="/" className={button({ variant: 'primary', size: 'lg' })}>
							<LucideArrowLeft className="size-4" />
							Back to Home
						</Link>

						<Link
							to="/books"
							className={button({ variant: 'ghost', size: 'lg' })}
						>
							My Books
						</Link>
					</div>

					<div className="w-px h-10 bg-border my-8 mx-auto" />

					<p className="font-mono text-muted uppercase text-xs tracking-widest mb-3">
						Where would you like to go?
					</p>

					<div className="flex gap-2 flex-wrap justify-center">
						{links.map(({ label, to }) => (
							<Link
								key={to}
								to={to}
								className="p-[6px_12px] border border-border bg-surface text-xs text-muted transition-all rounded-full hover:border-accent/30 hover:text-accent"
							>
								{label}
							</Link>
						))}
					</div>
				</div>
			</main>
		</div>
	)
}
