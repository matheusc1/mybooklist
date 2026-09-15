import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

vi.mock('@tanstack/react-devtools', () => ({
	TanStackDevtools: () => null,
}))

afterEach(() => {
	cleanup()
})

if (!window.ResizeObserver) {
	window.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	} as unknown as typeof ResizeObserver
}

Element.prototype.hasPointerCapture ??= () => false
Element.prototype.scrollIntoView ??= () => {}
