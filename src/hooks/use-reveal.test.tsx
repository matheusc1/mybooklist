import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '#/test/test-utils'
import { useReveal } from './use-reveal'

describe('useReveal', () => {
	let observe: ReturnType<typeof vi.fn>
	let disconnect: ReturnType<typeof vi.fn>
	let intersectionCallback: IntersectionObserverCallback

	beforeEach(() => {
		observe = vi.fn()
		disconnect = vi.fn()
		window.IntersectionObserver = class {
			root = null
			rootMargin = ''
			thresholds = []
			observe = observe
			unobserve = vi.fn()
			disconnect = disconnect
			takeRecords = () => []

			constructor(callback: IntersectionObserverCallback) {
				intersectionCallback = callback
			}
		} as unknown as typeof IntersectionObserver
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('observes the element and reveals it when it intersects', () => {
		function RevealTarget() {
			const ref = useReveal<HTMLDivElement>()
			return <div ref={ref} />
		}

		const { container, unmount } = render(<RevealTarget />)
		const element = container.firstElementChild

		expect(observe).toHaveBeenCalledWith(element)

		intersectionCallback(
			[{ isIntersecting: true } as IntersectionObserverEntry],
			{} as IntersectionObserver,
		)

		expect(element).toHaveClass('visible')

		unmount()
		expect(disconnect).toHaveBeenCalledOnce()
	})
})
