import { create } from 'zustand'

type GoalModalMode = 'add' | 'edit'

interface GoalModalStore {
	open: boolean
	mode: GoalModalMode
	openModal: (mode: GoalModalMode) => void
	closeModal: () => void
}

export const useGoalModalStore = create<GoalModalStore>((set) => ({
	open: false,
	mode: 'add',
	openModal: (mode) => set({ open: true, mode }),
	closeModal: () => set({ open: false }),
}))
