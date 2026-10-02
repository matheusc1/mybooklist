import { expect } from '@playwright/test'
import { authTest } from './fixtures/api'

function toLocalDateInputValue(date: Date) {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

authTest(
	'saves and reloads a book cover, rating, and optional dates',
	async ({ authenticated }) => {
		const page = await authenticated.context.newPage()
		const title = `E2E optional metadata ${Date.now()}`
		const totalPages = 12
		const rating = 4
		const completedAt = toLocalDateInputValue(new Date())
		const startedAtDate = new Date()
		startedAtDate.setFullYear(startedAtDate.getFullYear() - 1)
		const startedAt = toLocalDateInputValue(startedAtDate)

		await page.goto('/books')
		await expect(
			page.getByRole('heading', { name: 'Your library is empty' }),
		).toBeVisible()
		const coverUrl = 'https://example.com/e2e-book-cover.jpg'
		await page.getByRole('button', { name: 'Add Book' }).click()

		const dialog = page.getByRole('dialog')
		await dialog.getByLabel('Title').fill(title)
		await dialog.getByLabel('Author').fill('E2E Optional Metadata Author')
		await dialog.getByLabel('Book Cover').fill(coverUrl)
		await dialog.getByRole('combobox', { name: 'Genre' }).click()
		await page.getByRole('option', { name: 'Fantasy' }).click()
		await dialog.getByRole('radio', { name: 'Completed' }).click()
		await dialog.getByLabel('Total Pages').fill(String(totalPages))
		await dialog.getByRole('button', { name: `${rating} stars` }).click()
		await dialog.getByLabel('Date Started').fill(startedAt)
		await dialog.getByLabel('Date Completed').fill(completedAt)

		const createResponse = page.waitForResponse(
			(response) =>
				response.url().endsWith('/books') &&
				response.request().method() === 'POST',
		)
		await dialog.getByRole('button', { name: 'Save' }).click()
		expect((await createResponse).ok()).toBeTruthy()
		await expect(dialog).toBeHidden()

		const bookCard = page.getByRole('button', { name: new RegExp(title) })
		await expect(bookCard).toBeVisible()
		await expect(
			bookCard.getByRole('img', { name: `${title} cover` }),
		).toHaveAttribute('src', coverUrl)
		await expect(
			bookCard.getByRole('img', { name: `${rating} out of 5 stars` }),
		).toBeVisible()

		await page.reload()
		const reloadedCard = page.getByRole('button', {
			name: new RegExp(title),
		})
		await expect(reloadedCard).toBeVisible()
		await expect(
			reloadedCard.getByRole('img', { name: `${title} cover` }),
		).toHaveAttribute('src', coverUrl)
		await expect(
			reloadedCard.getByRole('img', { name: `${rating} out of 5 stars` }),
		).toBeVisible()

		await reloadedCard.click()
		const detailsDialog = page.getByRole('dialog')
		await detailsDialog.getByRole('button', { name: 'Edit Book' }).click()
		await expect(page.getByRole('heading', { name: 'Edit Book' })).toBeVisible()
		await expect(detailsDialog.getByLabel('Book Cover')).toHaveValue(coverUrl)
		await expect(detailsDialog.getByLabel('Date Started')).toHaveValue(
			startedAt,
		)
		await expect(detailsDialog.getByLabel('Date Completed')).toHaveValue(
			completedAt,
		)
	},
)
