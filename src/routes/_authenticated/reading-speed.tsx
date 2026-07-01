import { createFileRoute, Link } from '@tanstack/react-router'
import {
	LucideArrowRight,
	LucideBook,
	LucideLibrary,
	LucideLightbulb,
	LucideTarget,
	LucideTimer,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, button } from '#/components/ui/button'
import { Logo } from '#/components/ui/logo'
import { type Passage, readingPassages } from '#/data/passages'

export const Route = createFileRoute('/_authenticated/reading-speed')({
	staticData: { hideNav: true },
	component: ReadingSpeed,
})

const infoCards = [
	{
		icon: LucideBook,
		label: '2 passages',
		description: 'From a public domain book',
	},
	{
		icon: LucideTimer,
		label: '~5 min',
		description: 'Takes just a few minutes',
	},
	{
		icon: LucideTarget,
		label: 'Your pace',
		description: "Read normally, don't rush",
	},
]

type Step = 'intro' | 'reading' | 'result'
const stepNumber: Record<Step, number> = { intro: 1, reading: 2, result: 3 }

function getRandomPassage(lastPassageId?: string) {
	const availablePassages = readingPassages.filter(
		(passage) => passage.id !== lastPassageId,
	)

	if (availablePassages.length === 0) return readingPassages[0]
	return availablePassages[Math.floor(Math.random() * availablePassages.length)]
}

function formatPace(seconds: number) {
	const m = Math.floor(seconds / 60)
	const s = seconds % 60
	return s === 0 ? `${m} min` : `${m} min ${s} sec`
}

function ReadingSpeed() {
	const [step, setStep] = useState<Step>('intro')
	const [secondsPerPage, setSecondsPerPage] = useState(0)
	const [lastPassageId, setLastPassageId] = useState<string>()
	const [selectedPassage, setSelectedPassage] = useState(() =>
		getRandomPassage(),
	)

	const handleStart = () => {
		const nextPassage = getRandomPassage(lastPassageId)
		setSelectedPassage(nextPassage)
		setStep('reading')
	}

	return (
		<div className="overflow-hidden min-h-dvh">
			<div className="sticky top-0 bg-bg z-10">
				<nav className="flex w-full items-center justify-between h-17 px-5 sm:px-10">
					<Logo />

					<p className="font-mono tracking-widest text-muted text-xs uppercase">
						Step <span className="text-accent">{stepNumber[step]}</span> of 3
					</p>
				</nav>
				<div className="w-full h-px bg-border" />
			</div>

			<main className="max-w-170 mx-auto py-10 px-5 sm:px-10 space-y-8 animate-fade-up [animation-delay:0.02s]">
				{step === 'intro' && <IntroContent onStart={handleStart} />}
				{step === 'reading' && (
					<ReadingContent
						key={selectedPassage.id}
						passage={selectedPassage}
						onFinish={(secs) => {
							setSecondsPerPage(secs)
							setLastPassageId(selectedPassage.id)
							setStep('result')
						}}
					/>
				)}
				{step === 'result' && (
					<ResultContent
						secondsPerPage={secondsPerPage}
						onRetake={() => setStep('intro')}
					/>
				)}
			</main>
		</div>
	)
}

function IntroContent({ onStart }: { onStart: () => void }) {
	return (
		<>
			<div className="space-y-2.5">
				<p className="text-xs uppercase font-mono text-accent tracking-widest">
					Setup · Reading Speed
				</p>
				<h1 className="font-serif font-bold text-3xl/[1.2] tracking-tight">
					Let's measure your reading pace
				</h1>
				<p className="max-w-125 text-muted text-sm/[1.7]">
					You'll read 2 short passages at your own natural pace. We'll use the
					time to estimate how long your reading sessions actually take — no
					averages, just you.
				</p>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 [&>*:last-child]:col-span-2 [&>*:last-child]:sm:col-span-1 mb-10">
				{infoCards.map(({ icon: Icon, label, description }) => (
					<div
						key={label}
						className="bg-surface p-4 rounded-xl border border-border text-xs group transition-colors hover:bg-surface2"
					>
						<div className="size-8 rounded-lg bg-accent/10 border border-accent/15 flex items-center justify-center mb-3 transition-colors group-hover:bg-accent/15">
							<Icon aria-hidden="true" className="size-4 text-accent" />
						</div>
						<p className="font-medium mb-0.5">{label}</p>
						<p className="text-xs/[1.75] text-muted">{description}</p>
					</div>
				))}
			</div>

			<Button onClick={onStart} size="lg">
				Start Reading <LucideArrowRight aria-hidden="true" className="size-4" />
			</Button>
		</>
	)
}

function ReadingContent({
	passage,
	onFinish,
}: {
	passage: Passage
	onFinish: (secondsPerPage: number) => void
}) {
	const [seconds, setSeconds] = useState(0)
	const [page, setPage] = useState<1 | 2>(1)

	useEffect(() => {
		const start = Date.now()
		const interval = setInterval(() => {
			setSeconds(Math.floor((Date.now() - start) / 1000))
		}, 1000)
		return () => clearInterval(interval)
	}, [])

	const minutes = Math.floor(seconds / 60)
	const secs = seconds % 60
	const display = `${minutes}:${secs.toString().padStart(2, '0')}`

	function handleNextOrFinish() {
		if (page === 1) {
			setPage(2)
			window.scrollTo({ top: 0, behavior: 'smooth' })
			return
		}
		const secondsPerPage = Math.max(60, Math.round(seconds / 2))
		onFinish(secondsPerPage)
	}

	return (
		<>
			<div className="flex items-center justify-between mb-4">
				<div className="space-x-1">
					<span className="font-mono tracking-[0.08em] text-muted text-xs uppercase">
						{passage.title} · {passage.author}
					</span>
					<h1 className="font-serif font-semibold text-xl">Page {page} of 2</h1>
				</div>
				<div className="flex items-center bg-surface rounded-lg border border-border py-2 px-4 gap-2">
					<div
						aria-hidden="true"
						className="size-1.5 rounded-full bg-accent2 animate-pulse"
					/>
					<span className="font-mono text-sm min-w-10">{display}</span>
					<span className="text-xxs uppercase text-muted tracking-wider">
						Elapsed
					</span>
				</div>
			</div>

			<div className="h-0.5 bg-surface2 rounded-full overflow-hidden">
				<div
					role="progressbar"
					aria-label="Reading test progress"
					aria-valuenow={page === 1 ? 50 : 100}
					aria-valuemin={0}
					aria-valuemax={100}
					className="h-full bg-gradient-progress rounded-full transition-all duration-1000"
					style={{ width: page === 1 ? '50%' : '100%' }}
				/>
			</div>

			<div className="-mt-1 flex items-center gap-2 p-3 bg-surface border border-border border-l-2 border-l-accent rounded-lg">
				<LucideLightbulb aria-hidden="true" className="size-5 text-accent/80" />
				<p className="text-xs/normal text-muted">
					Read at your usual pace — don't rush or slow down. This is about your
					natural rhythm.
				</p>
			</div>

			<div className="-mt-2 bg-surface border border-border rounded-xl p-6 font-serif leading-loose text-text/85 space-y-3">
				{passage.pages[page - 1].map((paragraph) => (
					<p key={paragraph.slice(0, 20)} className="lining-nums">
						{paragraph}
					</p>
				))}
			</div>

			<div className="-mt-1 flex justify-end">
				<Button onClick={handleNextOrFinish} size="lg" className="ml-auto">
					{page === 1 ? 'Next page' : 'Finish'}{' '}
					<LucideArrowRight aria-hidden="true" className="size-4" />
				</Button>
			</div>
		</>
	)
}

function ResultContent({
	secondsPerPage,
	onRetake,
}: {
	secondsPerPage: number
	onRetake: () => void
}) {
	return (
		<div className="flex flex-col items-center justify-center text-center">
			<LucideLibrary
				aria-hidden="true"
				className="size-12 text-accent/80 mb-5"
			/>
			<p className="text-xs uppercase font-mono text-accent tracking-widest">
				Test complete
			</p>
			<h1 className="font-serif font-bold text-3xl tracking-tight mb-2">
				Here's your reading pace
			</h1>
			<p className="max-w-95 text-muted text-sm/[1.6] mb-9">
				Based on both passages, we calculated your average reading speed. This
				will be used to estimate your session durations going forward.
			</p>
			<div className="bg-surface border border-border2 rounded-2xl max-w-90 w-full py-7 px-10 mb-8">
				<p className="font-serif text-muted mb-1">
					<span className="text-5xl font-bold text-accent mr-1">
						{Math.floor(secondsPerPage / 60)}
					</span>{' '}
					min
				</p>
				<p className="font-mono text-xs uppercase text-muted tracking-widest mb-5">
					Average per page
				</p>
				<div aria-hidden="true" className="h-px bg-border mb-4" />
				<p className="text-xs/[1.6] text-muted">
					Your stats will now reflect{' '}
					<strong className="font-medium text-text/55">
						~{formatPace(secondsPerPage)} per page
					</strong>{' '}
					for all past and future reading sessions. You can retake this test
					anytime from your profile menu.
				</p>
			</div>
			<div className="flex items-center justify-center gap-3">
				<Button variant="ghost" onClick={onRetake}>
					Retake Test
				</Button>
				<Link to="/books" className={button()}>
					Go to my library
					<LucideArrowRight aria-hidden="true" className="size-4" />
				</Link>
			</div>
		</div>
	)
}
