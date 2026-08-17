import { create } from 'zustand'
import type { GoalProgress } from '#/types/goal'

type GoalModalMode = 'add' | 'edit'

interface GoalStore {
	// data
	goal: GoalProgress | null

	// modal
	open: boolean
	mode: GoalModalMode
	openModal: (mode: GoalModalMode) => void
	closeModal: () => void
	setMode: (mode: GoalModalMode) => void

	// actions (mocked for now)
	setGoal: (target: number) => void
}

const MOCKED_GOAL: GoalProgress = {
	year: new Date().getFullYear(),
	current: 2,
	target: 12,
}

export const useGoalStore = create<GoalStore>((set) => ({
	goal: MOCKED_GOAL, // null when user has no goal set

	open: false,
	mode: 'add',

	openModal: (mode) => set({ open: true, mode }),
	closeModal: () => set({ open: false }),
	setMode: (mode) => set({ mode }),

	setGoal: (target) =>
		set((state) => ({
			goal: {
				year: new Date().getFullYear(),
				current: state.goal?.current ?? 0,
				target,
			},
		})),
}))
