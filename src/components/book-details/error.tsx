import { BackLink } from './back-link'

export function BookDetailsError() {
	return (
		<main className="mx-auto min-h-[calc(100vh-69px)] max-w-275 p-5 lg:p-10">
			<BackLink className="text-sm text-muted transition-colors hover:text-accent" />
			<div className="mt-12 text-center">
				<h1 className="font-serif text-xl font-semibold">
					Unable to load book
				</h1>
				<p className="mt-2 text-sm text-muted">
					The book could not be loaded. Please try again later.
				</p>
			</div>
		</main>
	)
}
