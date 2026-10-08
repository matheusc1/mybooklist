import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '#/test/test-utils'
import { useReveal } from './use-reveal'

function RevealTarget() {
	const ref = useReveal<HTMLDivElement>()
	return <div ref={ref} />
}

function mockElementTop(top: number) {
	vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
		top,
	} as DOMRect)
}

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

	it('hides an element below the fold and reveals it when it intersects', () => {
		mockElementTop(window.innerHeight + 100)

		const { container, unmount } = render(<RevealTarget />)
		const element = container.firstElementChild

		expect(observe).toHaveBeenCalledWith(element)
		expect(element).toHaveAttribute('data-reveal', 'hidden')
		expect(element).not.toHaveClass('visible')

		intersectionCallback(
			[{ isIntersecting: true } as IntersectionObserverEntry],
			{} as IntersectionObserver,
		)

		expect(element).toHaveClass('visible')
		expect(disconnect).toHaveBeenCalledOnce()

		unmount()
		expect(disconnect).toHaveBeenCalledTimes(2)
	})

	it('keeps an element that is already on screen visible and does not observe it', () => {
		mockElementTop(0)

		const { container } = render(<RevealTarget />)
		const element = container.firstElementChild

		expect(observe).not.toHaveBeenCalled()
		expect(element).not.toHaveAttribute('data-reveal')
	})
})
