import { create } from 'zustand'
import type { ModalMode } from '#/types/common'

interface GoalModalStore {
	open: boolean
	mode: ModalMode
	openModal: (mode: ModalMode) => void
	closeModal: () => void
}

export const useGoalModalStore = create<GoalModalStore>((set) => ({
	open: false,
	mode: 'add',
	openModal: (mode) => set({ open: true, mode }),
	closeModal: () => set({ open: false }),
}))
