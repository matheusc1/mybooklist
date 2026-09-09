import { act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { renderHookWithProviders } from '#/test/test-utils'
import { useScrollSpy } from './use-scroll-spy'

describe('useScrollSpy', () => {
	beforeEach(() => {
		Object.defineProperty(window, 'innerHeight', {
			configurable: true,
			value: 800,
		})
		Object.defineProperty(window, 'scrollY', {
			configurable: true,
			value: 0,
			writable: true,
		})
		Object.defineProperty(document.documentElement, 'scrollHeight', {
			configurable: true,
			value: 2000,
		})
	})

	afterEach(() => {
		document.body.innerHTML = ''
	})

	it('starts with the first section and updates on scroll', () => {
		const first = document.createElement('section')
		first.id = 'first'
		const second = document.createElement('section')
		second.id = 'second'
		document.body.append(first, second)

		first.getBoundingClientRect = () =>
			({
				top: 0,
				bottom: 100,
			}) as DOMRect
		second.getBoundingClientRect = () =>
			({
				top: 300,
				bottom: 400,
			}) as DOMRect

		const { result } = renderHookWithProviders(() =>
			useScrollSpy(['first', 'second']),
		)

		expect(result.current).toBe('first')

		first.getBoundingClientRect = () =>
			({
				top: -300,
				bottom: -200,
			}) as DOMRect
		second.getBoundingClientRect = () =>
			({
				top: 100,
				bottom: 200,
			}) as DOMRect

		act(() => {
			window.dispatchEvent(new Event('scroll'))
		})

		expect(result.current).toBe('second')
	})

	it('selects the last section at the bottom of the page', () => {
		const first = document.createElement('section')
		first.id = 'first'
		const second = document.createElement('section')
		second.id = 'second'
		document.body.append(first, second)

		const rect = { top: 0, bottom: 100 } as DOMRect
		first.getBoundingClientRect = () => rect
		second.getBoundingClientRect = () => rect
		window.scrollY = 1200

		const { result } = renderHookWithProviders(() =>
			useScrollSpy(['first', 'second']),
		)

		expect(result.current).toBe('second')
	})
})
