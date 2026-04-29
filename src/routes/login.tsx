import { createFileRoute, Link } from '@tanstack/react-router'
import { GitHubIcon } from '#/components/github-icon'
import { GoogleIcon } from '#/components/google-icon'

export const Route = createFileRoute('/login')({
	component: Login,
})

function Login() {
	return (
		<div className="overflow-hidden grid grid-cols-[1fr_480px] h-dvh">
			<div className="relative bg-[#0a0a0c] overflow-hidden flex flex-col justify-between p-[48px_52px] border-r border-border animate-fade-up [animation-delay:0.05s]">
				<div
					className="absolute inset-0 pointer-events-none z-0
        bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.025)_0px,rgba(255,255,255,0.025)_1px,transparent_1px,transparent_80px)]"
				/>

				<div
					className="absolute -top-30 -left-20 w-125 h-125 pointer-events-none z-0
        bg-[radial-gradient(ellipse_at_center,rgba(200,169,110,0.12)_0%,transparent_65%)]"
				/>

				<div
					className="absolute -bottom-25 -right-15 w-105 h-105 pointer-events-none z-0
        bg-[radial-gradient(ellipse_at_center,rgba(139,184,168,0.09)_0%,transparent_65%)]"
				/>

				<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
					<div className="deco-title text-[9rem] -top-5 -left-7.5 rotate-[-4deg]">
						Crime and Punishment
					</div>

					<div className="deco-title text-[7rem] top-40 left-10 rotate-[-4deg]">
						The Final Empire
					</div>

					<div className="deco-title text-[11rem] top-77.5 -left-15 rotate-[-4deg]">
						Brave New World
					</div>

					<div className="deco-title text-[8rem] top-125 left-5 rotate-[-4deg]">
						The Hobbit
					</div>

					<div className="deco-title text-[13rem] top-160 -left-10 rotate-[-4deg]">
						1984
					</div>
				</div>

				<div className="flex items-center gap-2.5">
					<div className="size-8 bg-accent rounded-md flex items-center justify-center">
						<span className="font-serif text-sm text-bg font-bold">M</span>
					</div>
					<p className="font-serif font-semibold ">MyBookList</p>
				</div>

				<div className="flex flex-col justify-center px-3">
					<p className="font-serif text-accent/50 leading text-[80px]/[0.6] mb-5">
						"
					</p>
					<p className="font-serif italic text-2xl/[1.55] tracking-[-0.01em] text-text/85 mb-6">
						A reader lives a{' '}
						<em className="font-normal not-italic text-accent">
							thousand lives
						</em>{' '}
						before he dies. The man who never reads lives only one.
					</p>
					<div className="flex items-center gap-3">
						<div className="w-6 h-px bg-accent/50" />
						<p className="text-muted text-xs font-mono uppercase tracking-widest">
							George R. R. Martin
						</p>
					</div>
				</div>

				<div className="flex items-center gap-9">
					<div>
						<p className="font-bold font-serif text-2xl">
							12<span className="text-accent text-base">k+</span>
						</p>
						<p className="text-[11px] text-muted uppercase font-mono tracking-[0.08em]">
							Books tracked
						</p>
					</div>

					<div className="w-px bg-border h-full" />

					<div>
						<p className="font-bold font-serif text-2xl">
							3.4<span className="text-accent text-base">k</span>
						</p>
						<p className="text-[11px] text-muted uppercase font-mono tracking-[0.08em]">
							Active readers
						</p>
					</div>

					<div className="w-px bg-border h-full" />

					<div>
						<p className="font-bold font-serif text-2xl">
							98<span className="text-accent text-base">%</span>
						</p>
						<p className="text-[11px] text-muted uppercase font-mono tracking-[0.08em]">
							Goals reached
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col justify-center p-[60px_52px] relative bg-noise animate-fade-up [animation-delay:0.15s] stagger-fade-up">
				<p className="font-mono text-xs uppercase tracking-[0.12em] text-accent mb-2.5">
					Welcome back
				</p>
				<h1 className="font-serif text-[32px]/[1.2] tracking-tight font-bold mb-2">
					Sign In to <br />
					MyBookList
				</h1>
				<p className="text-sm/[1.6] text-muted mb-10">
					Track your reading, log sessions and reach your goals.
				</p>

				<div className="space-y-3">
					<button
						type="button"
						className="group w-full bg-surface py-3.5 px-5 flex items-center gap-3 rounded-[10px] border border-border cursor-pointer transition-all hover:bg-surface2 hover:border-[rgba(234,67,53,0.3)] hover:-translate-y-px hover:shadow-lg hover:shadow-black/30"
					>
						<GoogleIcon />
						<span className="text-sm font-medium">Continue with Google</span>
						<span className="text-xs transition-transform text-muted ml-auto group-hover:translate-x-0.5 group-hover:text-text">
							→
						</span>
					</button>

					<button
						type="button"
						className="group w-full bg-surface py-3.5 gap-3 px-5 flex items-center rounded-[10px] border border-border cursor-pointer transition-all hover:bg-surface2 hover:border-[rgba(255,255,255,0.2)] hover:-translate-y-px hover:shadow-lg hover:shadow-black/30"
					>
						<GitHubIcon />
						<span className="text-sm font-medium">Continue with GitHub</span>
						<span className="text-xs transition-transform text-muted ml-auto group-hover:translate-x-0.5 group-hover:text-text">
							→
						</span>
					</button>
				</div>

				<div className="flex items-center gap-3 my-7">
					<div className="flex-1 h-px bg-border" />

					<span className="text-[0.68rem] text-muted uppercase tracking-widest font-mono">
						Secure sign in
					</span>

					<div className="flex-1 h-px bg-border" />
				</div>

				<div className="bg-surface border border-border rounded-[10px] p-[16px_18px] flex gap-3">
					<span className="mt-px">🔒</span>
					<p className="text-xs/[1.6] text-muted">
						MyBookList uses{' '}
						<strong className="text-text/60 font-medium">OAuth 2.0</strong> — we
						never store your password. Your reading data is private and belongs
						only to you.
					</p>
				</div>

				<footer className="mt-9 text-[11px]/[1.7] text-muted text-center">
					<p>
						By signing in you agree to our{' '}
						<Link to="/terms" className="hover:underline hover:text-accent">
							Terms of Service
						</Link>{' '}
						and{' '}
						<Link to="/privacy" className="hover:underline hover:text-accent2">
							Privacy Policy
						</Link>
						.
					</p>
				</footer>
			</div>
		</div>
	)
}
