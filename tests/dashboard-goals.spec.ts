import { expect } from '@playwright/test'
import { authTest, seedBook } from './fixtures/api'

authTest(
	'creates a current-year goal and sees it persist after reload',
	async ({ authenticated }) => {
		const page = await authenticated.context.newPage()
		const target = 8
		const currentYear = new Date().getFullYear()

		await page.goto('/home')
		await expect(
			page.getByText('Add your first reading record to see stats here.'),
		).toBeVisible()
		await page
			.getByRole('button', { name: 'Set a goal and start reading.' })
			.click()

		const goalDialog = page.getByRole('dialog')
		await goalDialog.getByLabel('Books to read').fill(String(target))
		const upsertResponse = page.waitForResponse(
			(response) =>
				response.url().endsWith('/goals') &&
				response.request().method() === 'POST',
		)
		await goalDialog.getByRole('button', { name: 'Set Goal' }).click()
		expect((await upsertResponse).ok()).toBeTruthy()

		const goalProgress = page.getByRole('progressbar', {
			name: `Reading goal progress: 0 of ${target} books`,
		})
		// progressbar may be visually constrained by styling; assert its ARIA state instead
		await expect(goalProgress).toHaveAttribute('aria-valuenow', '0')
		await expect(page.getByText(`Reading Goal · ${currentYear}`)).toBeVisible()

		await page.reload()
		await expect(
			page.getByRole('progressbar', {
				name: `Reading goal progress: 0 of ${target} books`,
			}),
		).toHaveAttribute('aria-valuenow', '0')
	},
)

authTest(
	'updates goal progress when a book is completed',
	async ({ authenticated }) => {
		const page = await authenticated.context.newPage()
		const target = 1
		const book = await seedBook(authenticated.context.request, {
			title: `E2E goal completion ${Date.now()}`,
			totalPages: 10,
			currentPage: 0,
			status: 'reading',
		})

		await page.goto('/home')
		await expect(page.getByText(book.title)).toBeVisible()
		await page
			.getByRole('button', { name: 'Set a goal and start reading.' })
			.click()
		const goalDialog = page.getByRole('dialog')
		await goalDialog.getByLabel('Books to read').fill(String(target))
		const upsertResponse = page.waitForResponse(
			(response) =>
				response.url().endsWith('/goals') &&
				response.request().method() === 'POST',
		)
		await goalDialog.getByRole('button', { name: 'Set Goal' }).click()
		expect((await upsertResponse).ok()).toBeTruthy()

		const currentYear = new Date().getFullYear()
		await expect(page.getByText(`Reading Goal · ${currentYear}`)).toBeVisible()

		await page.getByRole('button', { name: 'Add Record' }).click()
		const sessionDialog = page.getByRole('dialog')
		await sessionDialog
			.getByRole('combobox', { name: 'Search books...' })
			.fill(book.title)
		await page.getByRole('option', { name: book.title }).click()
		await sessionDialog.getByLabel('To page').fill(String(book.totalPages))
		const sessionResponse = page.waitForResponse(
			(response) =>
				response.url().endsWith('/reading-sessions') &&
				response.request().method() === 'POST',
		)
		await sessionDialog.getByRole('button', { name: 'Set Record' }).click()
		expect((await sessionResponse).ok()).toBeTruthy()
		await expect(sessionDialog).toBeHidden()

		const goalProgress = page.getByRole('progressbar', {
			name: `Reading goal progress: 1 of ${target} books`,
		})
		// prefer checking ARIA value; full completion for 1 of 1 should be 100%
		await expect(goalProgress).toHaveAttribute('aria-valuenow', '100')
	},
)

authTest(
	'shows the empty dashboard state for a reader with no activity',
	async ({ authenticated }) => {
		const page = await authenticated.context.newPage()

		await page.goto('/home')
		await expect(
			page.getByText('Add your first reading record to see stats here.'),
		).toBeVisible()
		await expect(page.getByText('No books completed yet')).toBeVisible()
		await expect(
			page.getByText("You're not tracking any book right now."),
		).toBeVisible()
	},
)
