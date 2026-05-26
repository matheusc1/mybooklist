import { createFileRoute, Link } from '@tanstack/react-router'
import {
	LucideArrowRight,
	LucideChartLine,
	LucideCompass,
	LucideLibrary,
	LucideLock,
	LucideTarget,
	LucideTimer,
} from 'lucide-react'
import { button } from '#/components/ui/button'
import { Logo } from '#/components/ui/logo'
import { useReveal } from '#/hooks/use-reveal'
import { scrollTo } from '#/utils/scroll-to'

export const Route = createFileRoute('/')({
	component: LandingPage,
})

const stats = [
	{ value: '12', sup: 'k+', label: 'Books tracked' },
	{ value: '3.4', sup: 'k', label: 'Active readers' },
	{ value: '98', sup: '%', label: 'Goals reached' },
	{ value: '4.9', sup: '★', label: 'Average rating' },
]

const books = [
	{
		title: 'As I Lay Dying',
		sub: 'Reading · Oct 10',
	},
	{
		title: 'Lord of the Flies',
		sub: 'Finished · Oct 8',
	},
]

const finishedBooks = [
	{
		bookCover: '/covers/dune.jpg',
		title: 'Dune',
		author: 'Frank Herbert',
		stars: '★★★★☆',
	},
	{
		bookCover: '/covers/we.jpg',
		title: 'We',
		author: 'Yevgeny Zamyatin',
		stars: '★★★★★',
	},
	{
		bookCover: '/covers/david-copperfield.jpg',
		title: 'David Copperfield',
		author: 'Charles Dickens',
		stars: '★★★☆☆',
	},
]

const metrics = [
	{ val: '148', color: 'text-accent', desc: 'Pages' },
	{ val: '2h 02m', color: 'text-accent2', desc: 'Time' },
	{ val: '7', color: 'text-text', desc: 'Days' },
]

const features = [
	{
		icon: LucideLibrary,
		title: 'Your complete library',
		desc: 'Organize every book by status — reading, finished, paused, want to read. Your whole collection, always one click away.',
		tag: 'My Books',
	},
	{
		icon: LucideTimer,
		title: 'Session tracking',
		desc: 'Log reading sessions with page ranges. See exactly how many pages and hours you read each week, day by day.',
		tag: 'Activity',
	},
	{
		icon: LucideChartLine,
		title: 'Weekly statistics',
		desc: 'Charts, streaks, and reading time estimates personalized to your actual pace — not a generic average.',
		tag: 'Dashboard',
	},
	{
		icon: LucideTarget,
		title: 'Reading goals',
		desc: 'Set a yearly book goal and track your progress. See how many books you need per month to stay on track.',
		tag: 'Goals',
	},
	{
		icon: LucideLock,
		title: 'OAuth sign in',
		desc: 'No passwords to remember. Sign in securely with Google or GitHub. Your data is private and always yours.',
		tag: 'Security',
	},
	{
		icon: LucideCompass,
		title: 'Personal pace calibration',
		desc: "Take a short reading test and we'll calibrate your reading speed — so every time estimate actually reflects you.",
		tag: 'Reading Speed',
	},
]

function LandingPage() {
	return (
		<div className="min-h-dvh">
			<div className="sticky top-0 bg-bg z-100">
				<nav className="flex w-full items-center justify-between h-17 px-5 sm:px-15">
					<Logo textClassName="hidden sm:block" />
					<div className="flex gap-0.5 text-xs sm:text-sm text-muted uppercase tracking-wider transition-all">
						<button
							type="button"
							onClick={scrollTo('preview')}
							className="uppercase py-1.5 px-3 rounded-md hover:text-text hover:bg-surface2 cursor-pointer"
						>
							Preview
						</button>

						<button
							type="button"
							onClick={scrollTo('features')}
							className="uppercase py-1.5 px-3 rounded-md hover:text-text hover:bg-surface2 cursor-pointer"
						>
							Features
						</button>
					</div>
					<Link to="/login" className={button({ size: 'sm' })}>
						Get Started
						<LucideArrowRight className="size-4 hidden sm:block" />
					</Link>
				</nav>
				<div className="w-full h-px bg-border" />
			</div>

			<HeroSection />
			<StatsSection />
			<PreviewSection />
			<FeaturesSection />
		</div>
	)
}

function HeroSection() {
	return (
		<section className="relative flex items-center justify-center min-h-[calc(100dvh-69px)] overflow-hidden px-5 sm:px-15">
			<div className="absolute -top-25 -left-25 w-175 h-175 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,110,0.09)_0%,transparent_65%)]" />
			<div className="absolute -bottom-20 -right-20 w-150 h-150 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,rgba(139,184,168,0.07)_0%,transparent_65%)]" />

			<div className="absolute left-15 top-0 bottom-0 w-px bg-[linear-gradient(to_bottom,transparent,rgba(200,169,110,0.15),transparent)] hidden sm:block" />

			<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex flex-col justify-center">
				<div
					className="deco-title text-white/2 static"
					style={{ fontSize: 'clamp(80px, 12vw, 160px)', marginLeft: '-2%' }}
				>
					To Kill a Mockingbird
				</div>
				<div
					className="deco-title text-white/2 static"
					style={{ fontSize: 'clamp(60px, 9vw, 120px)', marginLeft: '5%' }}
				>
					One Hundred Years of Solitude
				</div>
				<div
					className="deco-title text-white/2 static"
					style={{ fontSize: 'clamp(100px, 15vw, 200px)', marginLeft: '-1%' }}
				>
					A Tale of Two Cities
				</div>
				<div
					className="deco-title text-white/2 static"
					style={{ fontSize: 'clamp(70px, 11vw, 150px)', marginLeft: '8%' }}
				>
					Dom Quixote
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
					MyBookList turns your reading habit into a story worth telling. Track
					progress, log sessions, and discover how much you actually read.
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

			<div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-up [animation-delay:0.6s]">
				<div className="w-px h-8 sm:h-10 bg-linear-to-b from-accent/80 to-transparent animate-pulse" />
			</div>
		</section>
	)
}

function StatsSection() {
	const ref = useReveal()

	return (
		<section className="py-20 px-15 bg-surface border-t border-b border-border">
			<div
				ref={ref}
				className="reveal max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-y-8"
			>
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
	)
}

function PreviewSection() {
	const headerRef = useReveal()
	const windowRef = useReveal()

	return (
		<section
			id="preview"
			className="py-25 px-5 sm:px-15 overflow-hidden relative"
		>
			<div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)]" />
			<div ref={headerRef} className="reveal text-center mb-15 space-y-3">
				<p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
					The app
				</p>
				<p className="font-serif font-bold text-2xl sm:text-3xl tracking-tight">
					Everything in one <em className="italic text-accent">clean view</em>
				</p>
			</div>

			<div
				ref={windowRef}
				className="reveal max-w-240 mx-auto bg-surface border border-white/12 rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)]"
			>
				<div className="flex items-center justify-between p-4 px-5 bg-surface2 border-b border-border">
					<div className="flex gap-1.5">
						<div className="size-2.5 rounded-full bg-danger" />
						<div className="size-2.5 rounded-full bg-accent" />
						<div className="size-2.5 rounded-full bg-[#7dba8a]" />
					</div>

					<div className="bg-surface3 py-1 px-3 rounded-md font-mono text-muted text-xxs">
						mybooklist.app
					</div>

					<div className="w-13" />
				</div>

				<div className="grid md:grid-cols-[220px_1fr_200px] lg:grid-cols-[260px_1fr_240px] md:h-95 md:divide-x divide-border">
					<div className="py-5 px-4 overflow-hidden">
						<p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">
							Bookshelf
						</p>

						<div className="relative bg-surface2 border border-border rounded-lg p-3 mb-4 overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[1.5px] before:bg-gradient-progress">
							<p className="font-mono text-[0.6rem] uppercase tracking-widest text-accent mb-2">
								Currently Reading
							</p>
							<div className="flex gap-2 items-start">
								<img
									src="/covers/hamlet.jpg"
									alt="Hamlet book cover"
									className="w-10 h-15 object-cover rounded-sm"
								/>
								<div className="flex-1">
									<p className="font-serif text-xxs font-semibold mb-px">
										Hamlet
									</p>
									<p className="text-[0.6rem] text-muted mb-2">
										William Shakespeare
									</p>
									<div className="flex justify-between text-[0.6rem] text-muted mb-1">
										<span>Page 179 of 330</span>
										<span className="text-accent font-mono">54%</span>
									</div>
									<div className="h-0.5 bg-surface3 rounded-full overflow-hidden">
										<div className="h-full w-[54%] bg-gradient-progress" />
									</div>
								</div>
							</div>
						</div>

						<p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-1">
							Recent Activity
						</p>

						{books.map((book) => (
							<div
								key={book.title}
								className="flex gap-2 books-center py-2 border-b border-border last:border-none"
							>
								<img
									src="/book-cover.jpg"
									alt="Default book cover"
									className="w-8 h-12 rounded-sm object-cover"
								/>

								<div className="space-y-2 mt-1">
									<p className="text-xs font-medium">{book.title}</p>
									<p className="font-mono text-xxs text-muted">{book.sub}</p>
								</div>
							</div>
						))}
					</div>

					<div className="py-5 px-4 overflow-hidden">
						<p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-3">
							Weekly Stats
						</p>

						<div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 mb-4 [&>*:last-child]:md:col-span-2 [&>*:last-child]:lg:col-span-1">
							{metrics.map((metric) => (
								<div
									key={metric.desc}
									className="bg-surface2 border border-border rounded-lg p-2.5"
								>
									<p
										className={`font-serif font-bold leading-none mb-1 ${metric.color} text-sm}`}
									>
										{metric.val}
									</p>
									<p className="font-mono text-[0.55rem] text-muted uppercase tracking-wider">
										{metric.desc}
									</p>
								</div>
							))}
						</div>

						<div className="bg-surface2 border border-border rounded-lg p-3">
							<p className="font-mono text-[0.6rem] text-muted uppercase tracking-widest mb-2.5">
								Pages per day
							</p>
							<div className="flex items-end gap-1.5 h-12.5">
								{[38, 90, 55, 28, 62, 42, 35].map((h, i) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: static data
										key={i}
										className={`flex-1 rounded-t-sm ${i === 1 ? 'bg-linear-to-b from-accent to-accent/60' : 'bg-linear-to-b from-accent2 to-accent2/50'}`}
										style={{ height: `${h}%` }}
									/>
								))}
							</div>
						</div>
					</div>

					<div className="py-5 px-4 overflow-hidden">
						<p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-0.5">
							Finished
						</p>

						{finishedBooks.map((book) => (
							<div
								key={book.title}
								className="flex gap-2.5 py-2.5 border-b border-border last:border-none items-start"
							>
								<img
									src={book.bookCover}
									alt="Book cover"
									className="w-9 h-13.5 rounded-sm object-cover"
								/>

								<div>
									<p className="font-serif text-xs/[1.3] font-semibold mb-0.5">
										{book.title}
									</p>
									<p className="text-[0.58rem] text-muted mb-2">
										{book.author}
									</p>
									<p className="text-xs text-accent">{book.stars}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

function FeaturesSection() {
	const headerRef = useReveal()
	const gridRef = useReveal()

	return (
		<section
			id="features"
			className="py-25 px-5 sm:px-15 overflow-hidden relative"
		>
			<div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)]" />

			<div ref={headerRef} className="reveal text-center mb-15 space-y-3">
				<p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
					Features
				</p>
				<p className="font-serif font-bold text-2xl sm:text-3xl tracking-tight">
					Built around{' '}
					<em className="italic text-accent">how readers actually read</em>
				</p>
			</div>

			<div
				ref={gridRef}
				className="reveal max-w-240 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden"
			>
				{features.map((feature) => {
					const Icon = feature.icon
					return (
						<div
							key={feature.tag}
							className="bg-bg p-8 transition-colors duration-200 hover:bg-surface group"
						>
							<div className="size-9 rounded-lg bg-accent/10 border border-accent/15 flex items-center justify-center mb-4 transition-colors group-hover:bg-accent/15">
								<Icon className="size-4 text-accent" />
							</div>
							<p className="font-serif font-semibold tracking-[-0.01em] mb-3">
								{feature.title}
							</p>
							<p className="text-sm/[1.7] text-muted">{feature.desc}</p>
							<span className="inline-block mt-3.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent border-b border-accent/30 pb-px">
								{feature.tag}
							</span>
						</div>
					)
				})}
			</div>
		</section>
	)
}
