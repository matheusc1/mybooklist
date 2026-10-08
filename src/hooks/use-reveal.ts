import { useEffect, useRef } from 'react'

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
	const ref = useRef<T>(null)

	useEffect(() => {
		const el = ref.current
		if (!el || !('IntersectionObserver' in window)) return

		if (el.getBoundingClientRect().top < window.innerHeight - 40) return

		el.dataset.reveal = 'hidden'

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					el.classList.add('visible')
					observer.disconnect()
				}
			},
			{ threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
		)
		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	return ref
}
