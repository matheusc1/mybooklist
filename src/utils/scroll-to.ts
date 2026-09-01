export const scrollTo = (id: string) => (e: React.MouseEvent) => {
	e.preventDefault()

	const el = document.getElementById(id)
	if (!el) return

	const top = el.getBoundingClientRect().top + window.scrollY - 88 // 88 = header height

	window.scrollTo({ top, behavior: 'smooth' })

	history.replaceState(null, '', `#${id}`)
}
