import { expect } from '@playwright/test'
import { authTest } from './fixtures/api'

authTest(
	'completes a book through a reading session and reflects it across the app',
	async ({ authenticated }, testInfo) => {
		const page = await authenticated.context.newPage()
		const suffix = testInfo.title.replace(/\s+/g, '-')
		const title = `E2E ${suffix} ${Date.now()}`
		const author = 'E2E Test Author'
		const totalPages = 4
		const fromPage = 0
		const toPage = totalPages
		const expectedPagesRead = toPage - fromPage + 1 // inclusive range

		await page.goto('/books')
		await expect(
			page.getByRole('heading', { name: 'Your library is empty' }),
		).toBeVisible()
		await page.getByRole('button', { name: 'Add Book' }).click()

		const bookDialog = page.getByRole('dialog')
		await bookDialog.getByLabel('Title').fill(title)
		await bookDialog.getByLabel('Author').fill(author)
		await bookDialog.getByRole('combobox', { name: 'Genre' }).click()
		await page.getByRole('option', { name: 'Fantasy' }).click()
		await bookDialog.getByRole('radio', { name: 'Reading' }).click()
		await bookDialog.getByLabel('Current Page').fill(String(fromPage))
		await bookDialog.getByLabel('Total Pages').fill(String(totalPages))

		const createBookResponsePromise = page.waitForResponse(
			(response) =>
				response.url().endsWith('/books') &&
				response.request().method() === 'POST',
		)
		await bookDialog.getByRole('button', { name: 'Save' }).click()
		expect((await createBookResponsePromise).ok()).toBeTruthy()

		const titlePattern = new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
		const bookCard = page.getByRole('button', { name: titlePattern })
		await expect(bookCard).toBeVisible()
		await expect(bookCard).toHaveAccessibleName(/Reading/)

		await page.getByRole('link', { name: 'Home', exact: true }).click()
		await expect(page).toHaveURL(/\/home$/)
		await page.getByRole('button', { name: 'Add Record' }).click()

		const sessionDialog = page.getByRole('dialog')
		const bookSearch = sessionDialog.getByRole('combobox', {
			name: 'Search books...',
		})
		await bookSearch.fill(title)
		await page.getByRole('option', { name: title }).click()
		await sessionDialog.getByLabel('To page').fill(String(toPage))

		const createSessionResponsePromise = page.waitForResponse(
			(response) =>
				response.url().endsWith('/reading-sessions') &&
				response.request().method() === 'POST',
		)
		await sessionDialog.getByRole('button', { name: 'Set Record' }).click()
		expect((await createSessionResponsePromise).ok()).toBeTruthy()
		await expect(sessionDialog).toBeHidden()

		await page.getByRole('link', { name: 'My Books' }).click()
		await expect(page).toHaveURL(/\/books$/)
		const completedBookCard = page.getByRole('button', { name: titlePattern })
		await expect(completedBookCard).toBeVisible()
		await expect(completedBookCard).toHaveAccessibleName(/Completed/)

		await page.getByRole('link', { name: 'Home', exact: true }).click()
		await expect(page).toHaveURL(/\/home$/)
		const completedSection = page.getByRole('region', { name: 'Completed' })
		await expect(completedSection.getByText(title)).toBeVisible()
		const weeklyStats = page.getByRole('region', { name: 'Weekly Stats' })
		await expect(
			weeklyStats.getByText(String(expectedPagesRead), { exact: true }),
		).toBeVisible()

		await page.getByRole('link', { name: 'Activity', exact: true }).click()
		await expect(page).toHaveURL(/\/activity$/)
		await page.getByRole('button', { name: /has reading session/ }).click()
		const session = page.getByRole('button', { name: titlePattern })
		await expect(session).toBeVisible()
		await expect(session).toContainText(`PP. ${fromPage}-${toPage}`)
	},
)
