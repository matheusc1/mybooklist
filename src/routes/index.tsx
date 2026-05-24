import { createFileRoute, Link } from '@tanstack/react-router'
import { LucideArrowRight } from 'lucide-react'
import { button } from '#/components/ui/button'
import { Logo } from '#/components/ui/logo'
import { scrollTo } from '#/utils/scroll-to'

export const Route = createFileRoute('/')({
	component: LadingPage,
})

const stats = [
	{ value: '12', sup: 'k+', label: 'Books tracked' },
	{ value: '3.4', sup: 'k', label: 'Active readers' },
	{ value: '98', sup: '%', label: 'Goals reached' },
	{ value: '4.9', sup: '★', label: 'Average rating' },
]

function LadingPage() {
	return (
		<div className="overflow-x-hidden min-h-dvh">
			<div className="sticky top-0 bg-bg z-10">
				<nav className="flex w-full items-center justify-between h-17 px-5 sm:px-15">
					<Logo textClassName="hidden sm:block" />
					<div className="flex gap-0.5 text-xs sm:text-sm text-muted uppercase tracking-wider transition-all">
						<button
							type="button"
							onClick={scrollTo('features')}
							className="uppercase py-1.5 px-3 rounded-md hover:text-text hover:bg-surface2 cursor-pointer"
						>
							Features
						</button>

						<button
							type="button"
							onClick={scrollTo('preview')}
							className="uppercase py-1.5 px-3 rounded-md hover:text-text hover:bg-surface2 cursor-pointer"
						>
							Preview
						</button>
					</div>
					<Link to="/login" className={button({ size: 'sm' })}>
						Get Started
						<LucideArrowRight className="size-4 hidden sm:block" />
					</Link>
				</nav>
				<div className="w-full h-px bg-border" />
			</div>

			<section className="relative flex items-center justify-center min-h-[calc(100dvh-69px)] overflow-hidden px-5 sm:px-15">
				<div className="absolute -top-25 -left-25 w-175 h-175 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,110,0.09)_0%,transparent_65%)]" />
				<div className="absolute -bottom-20 -right-20 w-150 h-150 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,rgba(139,184,168,0.07)_0%,transparent_65%)]" />

				<div className="absolute left-15 top-0 bottom-0 w-px bg-[linear-gradient(to_bottom,transparent,rgba(200,169,110,0.15),transparent)] hidden sm:block" />

				<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex flex-col justify-center">
					<div
						className="deco-title static"
						style={{ fontSize: 'clamp(80px, 12vw, 160px)', marginLeft: '-2%' }}
					>
						Crime and Punishment
					</div>
					<div
						className="deco-title static"
						style={{ fontSize: 'clamp(60px, 9vw, 120px)', marginLeft: '5%' }}
					>
						The Final Empire
					</div>
					<div
						className="deco-title static"
						style={{ fontSize: 'clamp(100px, 15vw, 200px)', marginLeft: '-1%' }}
					>
						Brave New World
					</div>
					<div
						className="deco-title static"
						style={{ fontSize: 'clamp(70px, 11vw, 150px)', marginLeft: '8%' }}
					>
						The Hobbit
					</div>
				</div>

				<div className="relative z-10 max-w-4xl w-full flex flex-col items-start animate-fade-up [animation-delay:0.05s]">
					<div className="inline-flex items-center gap-2 text-accent font-mono text-xxs uppercase tracking-[0.14em] bg-accent/8 border border-accent/20 px-3 py-1.5 rounded-full mb-7 animate-fade-up [animation-delay:0.1s]">
						<div className="size-1.5 rounded-full bg-accent" />
						Personal reading tracker
					</div>

					<h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)]/[1.1] font-bold tracking-tight mb-6 animate-fade-up [animation-delay:0.18s]">
						Every book you've read.
						<br />
						Every page that <em className="italic text-accent">changed you.</em>
					</h1>

					<p className="text-muted text-sm lg:text-base leading-[1.75] max-w-130 mb-10 animate-fade-up [animation-delay:0.26s]">
						MyBookList turns your reading habit into a story worth telling.
						Track progress, log sessions, and discover how much you actually
						read.
					</p>

					<div className="flex items-center gap-3 flex-wrap animate-fade-up [animation-delay:0.34s]">
						<Link to="/login" className={button({ size: 'lg' })}>
							Start for free
							<LucideArrowRight className="size-4" />
						</Link>

						<a
							href="#preview"
							className={button({ variant: 'ghost', size: 'lg' })}
						>
							See how it works
						</a>
					</div>

					<p className="mt-4 font-mono text-xs text-muted/50 tracking-wider animate-fade-up [animation-delay:0.4s]">
						Free · No password · Sign in with Google or GitHub
					</p>
				</div>

				<div className="absolute bottom-3 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-up [animation-delay:0.6s]">
					<div className="w-px h-8 sm:h-10 bg-linear-to-b from-accent/80 to-transparent animate-pulse" />
					<span className="font-mono text-[10px] text-muted uppercase tracking-widest">
						Scroll
					</span>
				</div>
			</section>

			<section className="py-20 px-15 bg-surface border-t border-b border-border">
				<div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-y-8">
					{stats.map((stat, i) => (
						<div
							key={stat.label}
							className={`px-5 text-center relative ${
								i !== 0
									? 'before:absolute before:left-0 before:top-[20%] before:bottom-[20%] before:w-px before:bg-border'
									: ''
							} ${i === 2 ? 'before:hidden sm:before:block' : ''}`}
						>
							<p className="font-serif text-4xl/[1.0] font-bold tracking-tight text-accent mb-1.5">
								{stat.value}
								<sup className="text-xl font-normal text-muted">{stat.sup}</sup>
							</p>
							<p className="font-mono text-xs text-muted uppercase tracking-widest">
								{stat.label}
							</p>
						</div>
					))}
				</div>
			</section>
		</div>
	)
}
