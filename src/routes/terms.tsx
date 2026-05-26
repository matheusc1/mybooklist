import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { LucideArrowLeft } from 'lucide-react'
import { Logo } from '#/components/ui/logo'
import { useScrollSpy } from '#/hooks/use-scroll-spy'
import { scrollTo } from '#/utils/scroll-to'

export const Route = createFileRoute('/terms')({
	component: TermsOfService,
})

const items = [
	{ id: 'acceptance', label: '1. Acceptance' },
	{ id: 'use', label: '2. Use of Service' },
	{ id: 'account', label: '3. Your Account' },
	{ id: 'content', label: '4. Your Content' },
	{ id: 'termination', label: '5. Termination' },
	{ id: 'liability', label: '6. Liability' },
	{ id: 'changes', label: '7. Changes' },
	{ id: 'contact', label: '8. Contact' },
]

const sections = items.map((item) => item.id)

function TermsOfService() {
	const router = useRouter()
	const activeSection = useScrollSpy(sections)

	const isActive = (id: string) =>
		activeSection === id
			? 'text-accent border-l-accent bg-accent/6'
			: 'border-transparent hover:text-text hover:bg-surface'

	return (
		<div className="min-h-dvh">
			<div className="sticky top-0 bg-bg/85 z-10 backdrop-blur-md">
				<nav className="flex w-full items-center justify-between h-17 px-5 sm:px-10">
					<Logo />

					<button
						type="button"
						onClick={() => router.history.back()}
						className="flex items-center justify-center gap-2 text-muted cursor-pointer hover:text-accent transition-colors"
					>
						<LucideArrowLeft className="size-4" />
						<p className="font-mono text-xs tracking-wider">Back to app</p>
					</button>
				</nav>
				<div className="w-full h-px bg-border" />
			</div>

			<div className="grid sm:grid-cols-[220px_1fr] max-w-240 mx-auto gap-10 md:gap-14 p-[56px_20px] md:p-[56px_40px] lg:p-14 pb-25 items-start">
				<aside className="hidden sm:block sticky top-22 animate-fade-up [animation-delay:0.05s]">
					<p className="font-mono uppercase text-xs tracking-widest text-muted mb-3">
						On this page
					</p>
					<ul className="flex flex-col gap-0.5 text-sm text-muted">
						{items.map((item) => (
							<li key={item.id}>
								<a
									href={`#${item.id}`}
									onClick={scrollTo(item.id)}
									className={`block border-l-2 w-full py-1.5 px-3 rounded-md ${isActive(item.id)}`}
									aria-current={activeSection === item.id ? 'true' : undefined}
								>
									{item.label}
								</a>
							</li>
						))}
					</ul>

					<div className="w-full h-px my-4 bg-border" />

					<div className="text-xs/[1.7] text-muted font-mono">
						<p>
							Also read our <br />
							<Link
								to="/privacy"
								className="text-accent2 cursor-pointer hover:underline"
							>
								Privacy Policy →
							</Link>
						</p>
					</div>
				</aside>

				<div className="animate-fade-up [animation-delay:0.1s]">
					<div className="space-y-2.5 mb-10">
						<p className="text-xs uppercase font-mono text-accent tracking-widest">
							Legal
						</p>
						<h1 className="font-serif font-bold text-4xl/[1.15] tracking-tight">
							Terms of Service
						</h1>
						<p className="font-mono text-muted text-sm">
							Last update: May 2026
						</p>
					</div>

					<div className="bg-surface border border-border border-l-3 border-l-accent rounded-xl p-5 text-sm/[1.7] text-text/75 mb-12">
						These Terms govern your use of MyBookList. By signing in, you agree
						to these terms. MyBookList is a personal portfolio project — it is
						provided as-is, with no warranties. Please read this document
						carefully before using the service.
					</div>

					<main className="space-y-12">
						<section id="acceptance" className="scroll-mt-25">
							<p className="font-mono text-accent uppercase text-xs tracking-widest mb-2">
								Section 1
							</p>
							<h2 className="font-serif font-semibold text-xl tracking-[-0.01em] mb-4 pb-3 border-b border-border">
								Acceptance of Terms
							</h2>
							<div className="space-y-3 text-sm/[1.8] text-text/70">
								<p>
									By accessing or using MyBookList, you confirm that you have
									read, understood, and agree to be bound by these Terms of
									Service. If you do not agree to these terms, you may not use
									the service.
								</p>
								<p>
									These terms apply to all users of the application, including
									visitors, registered users, and any other individuals who
									access or use the service.
								</p>
							</div>
						</section>

						<section id="use" className="scroll-mt-25">
							<p className="font-mono text-accent uppercase text-xs tracking-widest mb-2">
								Section 2
							</p>
							<h2 className="font-serif font-semibold text-xl tracking-[-0.01em] mb-4 pb-3 border-b border-border">
								Use of Service
							</h2>
							<div className="space-y-3 text-sm/[1.8] text-text/70">
								<p>
									MyBookList is a personal reading tracker. You may use the
									service to:
								</p>

								<ul className="flex flex-col gap-2 pl-1">
									<li>
										<div className="flex gap-2.5 items-center">
											<div className="h-px w-1.5 bg-accent" />
											<p>
												Track books you are reading, have read, or want to read
											</p>
										</div>
									</li>
									<li>
										<div className="flex gap-2.5 items-center">
											<div className="h-px w-1.5 bg-accent" />
											<p>Log reading sessions and monitor your progress</p>
										</div>
									</li>
									<li>
										<div className="flex gap-2.5 items-center">
											<div className="h-px w-1.5 bg-accent" />
											<p>Set and manage personal reading goals</p>
										</div>
									</li>
									<li>
										<div className="flex gap-2.5 items-center">
											<div className="h-px w-1.5 bg-accent" />
											<p>View statistics about your reading habits</p>
										</div>
									</li>
								</ul>

								<p>
									You agree not to use the service for any unlawful purpose or
									in a way that could harm other users or the service itself.
								</p>
							</div>
						</section>

						<section id="account" className="scroll-mt-25">
							<p className="font-mono text-accent uppercase text-xs tracking-widest mb-2">
								Section 3
							</p>
							<h2 className="font-serif font-semibold text-xl tracking-[-0.01em] mb-4 pb-3 border-b border-border">
								Your Account
							</h2>
							<div className="space-y-3 text-sm/[1.8] text-text/70">
								<p>
									MyBookList uses{' '}
									<strong className="font-medium text-text">OAuth 2.0</strong>{' '}
									via Google and GitHub for authentication. We do not store your
									password. Your identity is verified entirely through your
									chosen provider.
								</p>
								<p>
									You are responsible for maintaining the security of your
									account and for all activity that occurs under it. If you
									suspect unauthorized access, please sign out and revoke access
									through your OAuth provider immediately.
								</p>
							</div>
						</section>

						<section id="content" className="scroll-mt-25">
							<p className="font-mono text-accent uppercase text-xs tracking-widest mb-2">
								Section 4
							</p>
							<h2 className="font-serif font-semibold text-xl tracking-[-0.01em] mb-4 pb-3 border-b border-border">
								Your Content
							</h2>
							<div className="space-y-3 text-sm/[1.8] text-text/70">
								<p>
									All data you add to MyBookList — including books, reading
									sessions, notes, and goals — belongs to you. We do not claim
									ownership over your content.
								</p>
								<p>
									By using the service, you grant MyBookList a limited license
									to store and display your content solely for the purpose of
									providing the service to you.
								</p>
								<p>
									You may request deletion of your account and all associated
									data at any time.
								</p>
							</div>
						</section>

						<section id="termination" className="scroll-mt-25">
							<p className="font-mono text-accent uppercase text-xs tracking-widest mb-2">
								Section 5
							</p>
							<h2 className="font-serif font-semibold text-xl tracking-[-0.01em] mb-4 pb-3 border-b border-border">
								Termination
							</h2>
							<div className="space-y-3 text-sm/[1.8] text-text/70">
								<p>
									You may stop using MyBookList at any time. You may also
									request full account deletion, which will permanently remove
									all your data from our systems.
								</p>
								<p>
									We reserve the right to suspend or terminate accounts that
									violate these terms, misuse the service, or engage in any
									activity that could harm other users or the platform.
								</p>
							</div>
						</section>

						<section id="liability" className="scroll-mt-25">
							<p className="font-mono text-accent uppercase text-xs tracking-widest mb-2">
								Section 6
							</p>
							<h2 className="font-serif font-semibold text-xl tracking-[-0.01em] mb-4 pb-3 border-b border-border">
								Limitation of Liability
							</h2>
							<div className="space-y-3 text-sm/[1.8] text-text/70">
								<p>
									MyBookList is a{' '}
									<strong className="font-medium text-text">
										personal portfolio project
									</strong>{' '}
									provided as-is, without any warranties of any kind — express
									or implied. We do not guarantee that the service will be
									uninterrupted, error-free, or free of data loss.
								</p>
								<p>
									To the fullest extent permitted by law, MyBookList shall not
									be liable for any indirect, incidental, or consequential
									damages arising from your use of the service.
								</p>
							</div>
						</section>

						<section id="changes" className="scroll-mt-25">
							<p className="font-mono text-accent uppercase text-xs tracking-widest mb-2">
								Section 7
							</p>
							<h2 className="font-serif font-semibold text-xl tracking-[-0.01em] mb-4 pb-3 border-b border-border">
								Changes to These Terms
							</h2>
							<div className="space-y-3 text-sm/[1.8] text-text/70">
								<p>
									We may update these Terms of Service from time to time. When
									we do, we will update the date at the top of this page.
									Continued use of the service after changes constitutes your
									acceptance of the new terms.
								</p>
								<p>
									We encourage you to review this page periodically to stay
									informed about any updates.
								</p>
							</div>
						</section>

						<section id="contact" className="scroll-mt-25">
							<p className="font-mono text-accent uppercase text-xs tracking-widest mb-2">
								Section 8
							</p>
							<h2 className="font-serif font-semibold text-xl tracking-[-0.01em] mb-4 pb-3 border-b border-border">
								Contact
							</h2>
							<div className="space-y-3 text-sm/[1.8] text-text/70">
								<p>
									If you have any questions about these Terms of Service, you
									can reach out at{' '}
									<strong className="font-medium text-text">
										cardoso.matheusbs@gmail.com
									</strong>
									.
								</p>
							</div>
						</section>
					</main>

					<footer className="mt-12 flex items-center justify-between pt-6 border-t border-border">
						<p className="font-mono text-xs text-muted">
							MyBookList ·{' '}
							<Link to="/privacy" className="text-accent2 hover:underline">
								Privacy Policy
							</Link>{' '}
							· &copy; 2026
						</p>

						<button
							type="button"
							className="px-4 py-2 bg-surface border border-border rounded-lg text-xs text-accent cursor-pointer hover:text-text hover:border-white/20 hover:underline"
						>
							← Back to app
						</button>
					</footer>
				</div>
			</div>
		</div>
	)
}
