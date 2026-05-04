import { createFileRoute, Link } from '@tanstack/react-router'
import { LucideArrowLeft } from 'lucide-react'
import { Logo } from '#/components/logo'

export const Route = createFileRoute('/terms')({
	component: TermsOfService,
})

function TermsOfService() {
	return (
		<div className="min-h-dvh">
			<div className="sticky top-0 bg-bg z-10">
				<header className="flex w-full items-center justify-between h-17 px-5 sm:px-10">
					<Logo />

					<div className="flex items-center justify-center gap-2 text-muted cursor-pointer hover:text-accent transition-colors">
						<LucideArrowLeft className="w-4 h-4" />
						<p className="font-mono text-xs tracking-wider">Back to app</p>
					</div>
				</header>
				<div className="w-full h-px bg-border" />
			</div>

			<div className="grid grid-cols-[220px_1fr] max-w-240 mx-auto gap-14 p-14 items-start">
				<aside className="sticky top-22 animate-fade-up">
					<p className="font-mono uppercase text-xs tracking-widest text-muted mb-3">
						On this page
					</p>
					<ul className="flex flex-col gap-0.5 text-sm text-muted">
						<li className="py-1.5 px-3 rounded-md border-l-2 text-accent border-l-accent bg-accent/6 cursor-pointer">
							1. Acceptance
						</li>
						<li className="py-1.5 px-3 rounded-md border-l-2 border-transparent hover:text-text hover:bg-surface cursor-pointer">
							2. Use of Service
						</li>
						<li className="py-1.5 px-3 rounded-md border-l-2 border-transparent hover:text-text hover:bg-surface cursor-pointer">
							3. Your Account
						</li>
						<li className="py-1.5 px-3 rounded-md border-l-2 border-transparent hover:text-text hover:bg-surface cursor-pointer">
							4. Your content
						</li>
						<li className="py-1.5 px-3 rounded-md border-l-2 border-transparent hover:text-text hover:bg-surface cursor-pointer">
							5. Termination
						</li>
						<li className="py-1.5 px-3 rounded-md border-l-2 border-transparent hover:text-text hover:bg-surface cursor-pointer">
							6. Liability
						</li>
						<li className="py-1.5 px-3 rounded-md border-l-2 border-transparent hover:text-text hover:bg-surface cursor-pointer">
							7. Changes
						</li>
						<li className="py-1.5 px-3 rounded-md border-l-2 border-transparent hover:text-text hover:bg-surface cursor-pointer">
							8. Contact
						</li>
					</ul>

					<div className="w-full h-px my-4 bg-border" />

					<div className="text-xs/[1.7] text-muted font-mono">
						<span>
							Also read our <br />
							<Link
								to="/privacy"
								className="text-accent2 cursor-pointer hover:underline"
							>
								Privacy Policy →
							</Link>
						</span>
					</div>
				</aside>

				<div className="space-y-20">
					{Array.from({ length: 20 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: just to test
						<p key={i}>Conteúdo {i}</p>
					))}
				</div>
			</div>
		</div>
	)
}
