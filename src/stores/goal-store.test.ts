import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useGoalModalStore } from './goal-store'

describe('useGoalModalStore', () => {
	beforeEach(() => {
		useGoalModalStore.setState({ open: false, mode: 'add' })
	})

	it('starts closed in add mode', () => {
		expect(useGoalModalStore.getState()).toMatchObject({
			open: false,
			mode: 'add',
		})
	})

	it('opens the modal with the requested mode', () => {
		act(() => {
			useGoalModalStore.getState().openModal('edit')
		})

		expect(useGoalModalStore.getState()).toMatchObject({
			open: true,
			mode: 'edit',
		})
	})

	it('closes the modal while preserving its mode', () => {
		act(() => {
			useGoalModalStore.getState().openModal('edit')
			useGoalModalStore.getState().closeModal()
		})

		expect(useGoalModalStore.getState()).toMatchObject({
			open: false,
			mode: 'edit',
		})
	})
})
