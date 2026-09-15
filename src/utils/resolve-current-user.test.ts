import { afterEach, describe, expect, it, vi } from 'vitest'
import { getMe } from '#/http/auth'
import { getMeServer } from '#/http/auth-server'
import { resolveCurrentUser } from './resolve-current-user'

vi.mock('#/http/auth', () => ({
	getMe: vi.fn(),
}))

vi.mock('#/http/auth-server', () => ({
	getMeServer: vi.fn(),
}))

afterEach(() => {
	vi.unstubAllGlobals()
	vi.clearAllMocks()
})

describe('resolveCurrentUser', () => {
	it('uses getMeServer when window is undefined', async () => {
		vi.stubGlobal('window', undefined)
		vi.mocked(getMeServer).mockResolvedValue({ id: 'user-1' } as never)

		await resolveCurrentUser()

		expect(getMeServer).toHaveBeenCalledOnce()
		expect(getMe).not.toHaveBeenCalled()
	})

	it('uses getMe when window is defined', async () => {
		vi.mocked(getMe).mockResolvedValue({ id: 'user-1' } as never)

		await resolveCurrentUser()

		expect(getMe).toHaveBeenCalledOnce()
		expect(getMeServer).not.toHaveBeenCalled()
	})
})
