import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { LucideArrowLeft } from 'lucide-react'
import { Logo } from '#/components/ui/logo'
import { useScrollSpy } from '#/hooks/use-scroll-spy'
import { scrollTo } from '#/utils/scroll-to'

export const Route = createFileRoute('/privacy')({
	component: PrivacyPolicy,
})

const items = [
	{ id: 'collect', label: '1. What we collect' },
	{ id: 'use', label: '2. How We Use It' },
	{ id: 'storage', label: '3. Data Storage' },
	{ id: 'sharing', label: '4. Sharing of Data' },
	{ id: 'providers', label: '5. OAuth Providers' },
	{ id: 'rights', label: '6. Your Rights' },
	{ id: 'retention', label: '7. Data Retention' },
	{ id: 'contact', label: '8. Contact' },
]

const sections = items.map((item) => item.id)

function PrivacyPolicy() {
	const router = useRouter()
	const activeSection = useScrollSpy(sections)

	const isActive = (id: string) =>
		activeSection === id
			? 'text-accent2 border-l-accent2 bg-accent2/6'
			: 'border-transparent hover:text-text hover:bg-surface'

	return (
		<div className="min-h-dvh">
			<div className="sticky top-0 bg-bg z-10">
				<nav className="flex w-full items-center justify-between h-17 px-5 sm:px-10">
					<Logo />

					<button
						type="button"
						onClick={() => router.history.back()}
						className="flex items-center justify-center gap-2 text-muted cursor-pointer hover:text-accent2 transition-colors"
					>
						<LucideArrowLeft className="w-4 h-4" />
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
								to="/terms"
								className="text-accent cursor-pointer hover:underline"
							>
								Terms of Service →
							</Link>
						</p>
					</div>
				</aside>

				<div className="animate-fade-up [animation-delay:0.1s]">
					<div className="space-y-2.5 mb-10">
						<p className="text-xs uppercase font-mono text-accent2 tracking-widest">
							Legal
						</p>
						<h1 className="font-serif font-bold text-4xl/[1.15] tracking-tight">
							Privacy Policy
						</h1>
						<p className="font-mono text-muted text-sm">
							Last update: May 2026
						</p>
					</div>

					<div className="bg-surface border border-border border-l-3 border-l-accent2 rounded-[10px] p-5 text-sm/[1.7] text-text/75 mb-12">
						Your privacy matters. MyBookList is a personal portfolio project —
						we collect only what is strictly necessary to provide the service,
						we never sell your data, and you can request full deletion of your
						account at any time.
					</div>

					<main className="space-y-12">
						<section id="collect" className="scroll-mt-25">
							<p className="font-mono text-accent2 uppercase text-xs tracking-widest mb-2">
								Section 1
							</p>
							<h2 className="font-serif font-semibold text-xl tracking-[-0.01em] mb-4 pb-3 border-b border-border">
								What We Collect
							</h2>
							<div className="space-y-3 text-sm/[1.8] text-text/70">
								<p>
									We collect only the minimum information required to provide
									the service:
								</p>

								<div className="bg-surface2 p-4 border border-border rounded-[10px] flex flex-col gap-2.5">
									<div className="flex gap-3 items-start">
										<p className="font-mono text-xs uppercase tracking-wider text-accent2 min-w-30 mt-0.5">
											Name
										</p>
										<p className="text-text/70 text-sm/[1.6]">
											Your display name, provided by your OAuth provider (Google
											or GitHub).
										</p>
									</div>

									<div className="flex gap-3 items-start">
										<p className="font-mono text-xs uppercase tracking-wider text-accent2 min-w-30 mt-0.5">
											Email
										</p>
										<p className="text-text/70 text-sm/[1.6]">
											Your email address, used solely to identify your account.
										</p>
									</div>

									<div className="flex gap-3 items-start">
										<p className="font-mono text-xs uppercase tracking-wider text-accent2 min-w-30 mt-0.5">
											Profile photo
										</p>
										<p className="text-text/70 text-sm/[1.6]">
											Your avatar URL from your OAuth provider, displayed in the
											app interface.
										</p>
									</div>

									<div className="flex gap-3 items-start">
										<p className="font-mono text-xs uppercase tracking-wider text-accent2 min-w-30 mt-0.5">
											READING DATA
										</p>
										<p className="text-text/70 text-sm/[1.6]">
											Books, sessions, goals, and progress that you manually add
											to the app.
										</p>
									</div>
								</div>

								<p>
									We do not collect browsing data, device fingerprints, or any
									information beyond what you explicitly provide.
								</p>
							</div>
						</section>

						<section id="use" className="scroll-mt-25">
							<p className="font-mono text-accent2 uppercase text-xs tracking-widest mb-2">
								Section 2
							</p>
							<h2 className="font-serif font-semibold text-xl tracking-[-0.01em] mb-4 pb-3 border-b border-border">
								How We Use It
							</h2>
							<div className="space-y-3 text-sm/[1.8] text-text/70">
								<p>The information we collect is used exclusively to:</p>

								<ul className="flex flex-col gap-2 pl-1">
									<li>
										<div className="flex gap-2.5 items-center">
											<div className="h-px w-1.5 bg-accent2" />
											<p>Authenticate you and maintain your session</p>
										</div>
									</li>
									<li>
										<div className="flex gap-2.5 items-center">
											<div className="h-px w-1.5 bg-accent2" />
											<p>
												Display your reading library, sessions, and statistics
											</p>
										</div>
									</li>
									<li>
										<div className="flex gap-2.5 items-center">
											<div className="h-px w-1.5 bg-accent2" />
											<p>Associate your reading data with your account</p>
										</div>
									</li>
									<li>
										<div className="flex gap-2.5 items-center">
											<div className="h-px w-1.5 bg-accent2" />
											<p>Allow you to manage and delete your own data</p>
										</div>
									</li>
								</ul>

								<p>
									We do <strong className="font-medium text-text">not</strong>{' '}
									use your data for advertising, profiling, or any purpose
									beyond providing the service described above.
								</p>
							</div>
						</section>

						<section id="storage" className="scroll-mt-25">
							<p className="font-mono text-accent2 uppercase text-xs tracking-widest mb-2">
								Section 3
							</p>
							<h2 className="font-serif font-semibold text-xl tracking-[-0.01em] mb-4 pb-3 border-b border-border">
								Data Storage
							</h2>
							<div className="space-y-3 text-sm/[1.8] text-text/70">
								<p>
									Your data is stored in a{' '}
									<strong className="font-medium text-text">
										PostgreSQL database
									</strong>{' '}
									hosted on Neon. Data is stored securely and is only accessible
									through authenticated requests made by your account.
								</p>
								<p>
									We do not store your OAuth credentials or passwords —
									authentication is handled entirely by Google and GitHub
									through the OAuth 2.0 protocol.
								</p>
							</div>
						</section>

						<section id="sharing" className="scroll-mt-25">
							<p className="font-mono text-accent2 uppercase text-xs tracking-widest mb-2">
								Section 4
							</p>
							<h2 className="font-serif font-semibold text-xl tracking-[-0.01em] mb-4 pb-3 border-b border-border">
								Sharing of Data
							</h2>
							<div className="space-y-3 text-sm/[1.8] text-text/70">
								<p>
									We do not sell, rent, or share your personal data with third
									parties. Period.
								</p>
								<p>
									The only external services that handle any part of your data
									are:
								</p>

								<ul className="flex flex-col gap-2 pl-1">
									<li>
										<div className="flex gap-2.5 items-center">
											<div className="h-px w-1.5 bg-accent2" />
											<p className="font-medium text-text">Google/GitHub</p>
											<p>— for authentication only, via OAuth 2.0</p>
										</div>
									</li>
									<li>
										<div className="flex gap-2.5 items-center">
											<div className="h-px w-1.5 bg-accent2" />
											<p className="font-medium text-text">Neon</p>
											<p>— for database hosting</p>
										</div>
									</li>
								</ul>

								<p>
									These services have their own privacy policies and are used
									solely to enable the core functionality of MyBookList.
								</p>
							</div>
						</section>

						<section id="providers" className="scroll-mt-25">
							<p className="font-mono text-accent2 uppercase text-xs tracking-widest mb-2">
								Section 5
							</p>
							<h2 className="font-serif font-semibold text-xl tracking-[-0.01em] mb-4 pb-3 border-b border-border">
								OAuth Providers
							</h2>
							<div className="space-y-3 text-sm/[1.8] text-text/70">
								<p>
									MyBookList uses{' '}
									<strong className="font-medium text-text">
										Google and GitHub
									</strong>{' '}
									for sign-in via OAuth 2.0. When you authenticate, we receive a
									limited set of profile information (name, email, and avatar)
									from your chosen provider.
								</p>
								<p>
									We request only the minimum scopes necessary. We do not access
									your Google Drive, Gmail, GitHub repositories, or any other
									data beyond basic profile information.
								</p>
								<p>
									You can revoke MyBookList's access at any time through your
									Google or GitHub account settings.
								</p>
							</div>
						</section>

						<section id="rights" className="scroll-mt-25">
							<p className="font-mono text-accent2 uppercase text-xs tracking-widest mb-2">
								Section 6
							</p>
							<h2 className="font-serif font-semibold text-xl tracking-[-0.01em] mb-4 pb-3 border-b border-border">
								Your Rights
							</h2>
							<div className="space-y-3 text-sm/[1.8] text-text/70">
								<p>
									You have full control over your data. At any time, you may:
								</p>

								<ul className="flex flex-col gap-2 pl-1">
									<li>
										<div className="flex gap-2.5 items-center">
											<div className="h-px w-1.5 bg-accent2" />
											<p>Access all data associated with your account</p>
										</div>
									</li>
									<li>
										<div className="flex gap-2.5 items-center">
											<div className="h-px w-1.5 bg-accent2" />
											<p>Edit or delete any reading entry, session, or goal</p>
										</div>
									</li>
									<li>
										<div className="flex gap-2.5 items-center">
											<div className="h-px w-1.5 bg-accent2" />
											<p>
												Request complete deletion of your account and all
												associated data
											</p>
										</div>
									</li>
									<li>
										<div className="flex gap-2.5 items-center">
											<div className="h-px w-1.5 bg-accent2" />
											<p>
												Revoke OAuth access through your provider's settings
											</p>
										</div>
									</li>
								</ul>

								<p>
									To request account deletion, contact us at{' '}
									<strong className="font-medium text-text">
										cardoso.matheusbs@gmail.com
									</strong>{' '}
									and we will process your request within 7 days.
								</p>
							</div>
						</section>

						<section id="retention" className="scroll-mt-25">
							<p className="font-mono text-accent2 uppercase text-xs tracking-widest mb-2">
								Section 7
							</p>
							<h2 className="font-serif font-semibold text-xl tracking-[-0.01em] mb-4 pb-3 border-b border-border">
								Data Retention
							</h2>
							<div className="space-y-3 text-sm/[1.8] text-text/70">
								<p>
									We retain your data for as long as your account is active. If
									you request account deletion, all your personal data and
									reading records will be permanently removed from our systems.
								</p>
								<p>
									We do not keep backups of deleted accounts beyond a 7-day
									window after deletion, after which the data is irrecoverable.
								</p>
							</div>
						</section>

						<section id="contact" className="scroll-mt-25">
							<p className="font-mono text-accent2 uppercase text-xs tracking-widest mb-2">
								Section 8
							</p>
							<h2 className="font-serif font-semibold text-xl tracking-[-0.01em] mb-4 pb-3 border-b border-border">
								Contact
							</h2>
							<div className="space-y-3 text-sm/[1.8] text-text/70">
								<p>
									If you have any questions or concerns about this Privacy
									Policy or how your data is handled, please reach out at{' '}
									<strong className="font-medium text-text">
										cardoso.matheusbs@gmail.com
									</strong>
									. We will respond as soon as possible.
								</p>
							</div>
						</section>
					</main>

					<footer className="mt-12 flex items-center justify-between pt-6 border-t border-border">
						<p className="font-mono text-xs text-muted">
							MyBookList ·{' '}
							<Link to="/terms" className="text-accent hover:underline">
								Terms of Service
							</Link>{' '}
							· &copy; 2026
						</p>

						<button
							type="button"
							className="px-4 py-2 bg-surface border border-border rounded-lg text-xs text-accent2 cursor-pointer hover:text-text hover:border-white/20 hover:underline"
						>
							← Back to app
						</button>
					</footer>
				</div>
			</div>
		</div>
	)
}
