import { useEffect, useState } from 'react'

export function useScrollSpy(ids: string[]) {
	const [activeId, setActiveId] = useState(ids[0])

	useEffect(() => {
		const elements = ids
			.map((id) => document.getElementById(id))
			.filter((el): el is HTMLElement => el !== null)

		const handleScroll = () => {
			const LINE = 88 + window.innerHeight * 0.2

			let current = ids[0]

			for (const el of elements) {
				const rect = el.getBoundingClientRect()

				if (rect.top <= LINE && rect.bottom >= LINE) {
					current = el.id
					break
				}

				if (rect.top < LINE) {
					current = el.id
				}
			}

			const nearBottom =
				window.innerHeight + window.scrollY >=
				document.documentElement.scrollHeight

			if (nearBottom) {
				current = ids[ids.length - 1]
			}

			setActiveId((prev) => (prev === current ? prev : current))
		}

		handleScroll()

		window.addEventListener('scroll', handleScroll, { passive: true })
		window.addEventListener('resize', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
			window.removeEventListener('resize', handleScroll)
		}
	}, [ids])

	return activeId
}
