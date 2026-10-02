import { expect } from '@playwright/test'
import { authTest, seedBook } from './fixtures/api'

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

		const titlePattern = new RegExp(
			title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
		)
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

authTest(
	'edits and deletes a library book with persisted results',
	async ({ authenticated }) => {
		const page = await authenticated.context.newPage()
		const book = await seedBook(authenticated.context.request, {
			title: `E2E library edit ${Date.now()}`,
			status: 'reading',
		})
		const updatedTitle = `${book.title} Updated`
		const originalCard = page.getByRole('button', {
			name: new RegExp(book.title),
		})

		await page.goto('/books')
		await expect(originalCard).toBeVisible()
		await originalCard.click()

		const detailsDialog = page.getByRole('dialog')
		await detailsDialog.getByRole('button', { name: 'Edit Book' }).click()
		await detailsDialog.getByLabel('Title').fill(updatedTitle)
		const updateResponse = page.waitForResponse(
			(response) =>
				/\/books\/[^/]+$/.test(new URL(response.url()).pathname) &&
				response.request().method() === 'PATCH',
		)
		await detailsDialog.getByRole('button', { name: 'Save' }).click()
		expect((await updateResponse).ok()).toBeTruthy()

		const updatedCard = page.getByRole('button', {
			name: new RegExp(updatedTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
		})
		await expect(updatedCard).toBeVisible()
		await page.reload()
		await expect(updatedCard).toBeVisible()
		await updatedCard.click()

		await page.getByRole('button', { name: 'Delete book' }).click()
		const deleteDialog = page.getByRole('dialog').last()
		const deleteResponse = page.waitForResponse(
			(response) =>
				/\/books\/[^/]+$/.test(new URL(response.url()).pathname) &&
				response.request().method() === 'DELETE',
		)
		await deleteDialog.getByRole('button', { name: 'Delete' }).click()
		expect((await deleteResponse).ok()).toBeTruthy()
		await expect(
			page.getByRole('heading', { name: 'Your library is empty' }),
		).toBeVisible()
	},
)

authTest(
	'searches and filters real library books',
	async ({ authenticated }) => {
		const request = authenticated.context.request
		const suffix = Date.now()
		const readingBook = await seedBook(request, {
			title: `E2E search reading ${suffix}`,
			status: 'reading',
		})
		const plannedBook = await seedBook(request, {
			title: `E2E search planned ${suffix}`,
			status: 'planned',
		})
		const page = await authenticated.context.newPage()

		await page.goto('/books')
		const readingCard = page.getByRole('button', {
			name: new RegExp(
				readingBook.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
			),
		})
		const plannedCard = page.getByRole('button', {
			name: new RegExp(
				plannedBook.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
			),
		})
		await expect(readingCard).toBeVisible()
		await expect(plannedCard).toBeVisible()

		const search = page.getByRole('textbox', {
			name: 'Search by title or author',
		})
		await search.fill(plannedBook.title)
		await expect(plannedCard).toBeVisible()
		await expect(readingCard).toBeHidden()

		await search.press('Escape')
		// Scoped to the filter group: every book card also carries its status label
		// (for example "Want to read") in its accessible name, so an unscoped match
		// would hit the planned card as well as the filter button.
		const statusFilter = page.getByRole('group', {
			name: 'Filter books by status',
		})
		await statusFilter.getByRole('button', { name: /Want to read/ }).click()
		await expect(plannedCard).toBeVisible()
		await expect(readingCard).toBeHidden()
	},
)
