import { expect } from '@playwright/test'
import { authTest, seedBook, seedSession } from './fixtures/api'

authTest(
	'creates, edits, and deletes a reading session across dashboard and activity',
	async ({ authenticated }) => {
		const request = authenticated.context.request
		const book = await seedBook(request, {
			title: `E2E session tracking ${Date.now()}`,
			currentPage: 1,
			totalPages: 10,
			status: 'reading',
		})
		const fromPage = book.currentPage
		const initialToPage = 3
		const updatedToPage = 5
		const initialPagesRead = initialToPage - fromPage + 1
		const updatedPagesRead = updatedToPage - fromPage + 1
		const initialMinutes = initialPagesRead
		const updatedMinutes = updatedPagesRead
		const page = await authenticated.context.newPage()

		await page.goto('/books')
		const bookTitle = new RegExp(
			book.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
		)
		await expect(page.getByRole('button', { name: bookTitle })).toBeVisible({
			timeout: 20_000,
		})

		await page.getByRole('link', { name: 'Home', exact: true }).click()
		await expect(page.getByText(book.title)).toBeVisible()
		await page.getByRole('button', { name: 'Add Record' }).click()

		const sessionDialog = page.getByRole('dialog')
		await sessionDialog
			.getByRole('combobox', { name: 'Search books...' })
			.fill(book.title)
		await page.getByRole('option', { name: book.title }).click()
		await expect(sessionDialog.getByLabel('From page')).toHaveValue(
			String(fromPage),
		)
		await sessionDialog.getByLabel('To page').fill(String(initialToPage))

		const createResponse = page.waitForResponse(
			(response) =>
				response.url().endsWith('/reading-sessions') &&
				response.request().method() === 'POST',
		)
		await sessionDialog.getByRole('button', { name: 'Set Record' }).click()
		expect((await createResponse).ok()).toBeTruthy()
		await expect(sessionDialog).toBeHidden()

		await page.getByRole('link', { name: 'My Books' }).click()
		const readingBook = page.getByRole('button', { name: bookTitle })
		await expect(readingBook).toBeVisible()
		await expect(readingBook).toHaveAccessibleName(/Reading/)

		await page.getByRole('link', { name: 'Home', exact: true }).click()
		const weeklyStats = page.getByRole('region', { name: 'Weekly Stats' })
		await expect(
			weeklyStats.getByText(String(initialPagesRead), { exact: true }),
		).toBeVisible()
		await expect(
			page.getByText('Hours read').locator('..').getByText('~1h'),
		).toBeVisible()

		await page.getByRole('link', { name: 'Activity', exact: true }).click()
		const today = new Date()
		const dayLabel = new Intl.DateTimeFormat('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}).format(today)
		await page
			.getByRole('button', {
				name: new RegExp(`${dayLabel}.*has reading session`),
			})
			.click()
		const firstSession = page.getByRole('button', {
			name: new RegExp(
				`${book.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*pages ${fromPage}-${initialToPage}.*${initialMinutes} minutes`,
			),
		})
		await expect(firstSession).toBeVisible()

		await firstSession.click()
		const viewDialog = page.getByRole('dialog').last()
		await viewDialog.getByRole('button', { name: 'Edit' }).click()
		await viewDialog.getByLabel('To page').fill(String(updatedToPage))
		const updateResponse = page.waitForResponse(
			(response) =>
				/\/reading-sessions\/[^/]+$/.test(new URL(response.url()).pathname) &&
				response.request().method() === 'PATCH',
		)
		await viewDialog.getByRole('button', { name: 'Save' }).click()
		expect((await updateResponse).ok()).toBeTruthy()
		await expect(
			page.getByRole('heading', { name: 'Edit Session' }),
		).toBeHidden()
		await page.getByRole('button', { name: 'Close' }).click()

		await page.getByRole('link', { name: 'Home', exact: true }).click()
		await expect(
			weeklyStats.getByText(String(updatedPagesRead), { exact: true }),
		).toBeVisible()
		await expect(
			page.getByText('Hours read').locator('..').getByText('~1h'),
		).toBeVisible()

		await page.getByRole('link', { name: 'Activity', exact: true }).click()
		await page
			.getByRole('button', {
				name: new RegExp(`${dayLabel}.*has reading session`),
			})
			.click()
		const updatedSession = page.getByRole('button', {
			name: new RegExp(
				`${book.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*pages ${fromPage}-${updatedToPage}.*${updatedMinutes} minutes`,
			),
		})
		await expect(updatedSession).toBeVisible()
		await updatedSession.click()

		const sessionViewDialog = page.getByRole('dialog').last()
		await sessionViewDialog
			.getByRole('button', { name: 'Delete session' })
			.click()
		const deleteDialog = page.getByRole('dialog').last()
		const deleteResponse = page.waitForResponse(
			(response) =>
				/\/reading-sessions\/[^/]+/.test(new URL(response.url()).pathname) &&
				response.request().method() === 'DELETE',
		)
		await deleteDialog.getByRole('button', { name: 'Delete' }).click()
		expect((await deleteResponse).ok()).toBeTruthy()
		await expect(page.getByText('No sessions logged')).toBeVisible()
		await page.getByRole('button', { name: 'Close' }).click()

		await page.getByRole('link', { name: 'Home', exact: true }).click()
		await expect(
			page.getByText('Add your first reading record to see stats here.'),
		).toBeVisible()
	},
)

authTest(
	'drills into a prior-month activity session without weekly credit',
	async ({ authenticated }) => {
		const request = authenticated.context.request
		const book = await seedBook(request, {
			title: `E2E prior month ${Date.now()}`,
			currentPage: 0,
			totalPages: 30,
			status: 'reading',
		})
		const today = new Date()
		const previousMonth = new Date(
			today.getFullYear(),
			today.getMonth() - 1,
			15,
		)
		const readAt = [
			previousMonth.getFullYear(),
			String(previousMonth.getMonth() + 1).padStart(2, '0'),
			'15',
		].join('-')
		const previousMonthLabel = new Intl.DateTimeFormat('en-US', {
			month: 'long',
			year: 'numeric',
		}).format(previousMonth)
		const session = await seedSession(request, {
			bookId: book.id,
			fromPage: 0,
			toPage: 2,
			readAt,
		})
		const page = await authenticated.context.newPage()

		await page.goto('/home')
		const weeklyStats = page.getByRole('region', { name: 'Weekly Stats' })
		await expect(
			weeklyStats.getByText('Pages read').locator('..'),
		).toContainText('--')

		await page.goto('/activity')
		await expect(page.getByRole('heading', { name: 'Activity' })).toBeVisible()
		const monthlySessions = page.getByText('Sessions this month').locator('..')
		await expect(monthlySessions).toContainText('--')

		await page.getByRole('button', { name: 'Previous month' }).click()
		await expect(
			page.getByRole('heading', { name: previousMonthLabel }),
		).toBeVisible()

		const sessionDayLabel = new Intl.DateTimeFormat('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}).format(previousMonth)
		await page
			.getByRole('button', {
				name: new RegExp(`${sessionDayLabel}.*has reading session`),
			})
			.click()

		const sessionDetail = page.getByRole('button', {
			name: new RegExp(
				`${book.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*pages ${session.fromPage}-${session.toPage}`,
			),
		})
		await expect(sessionDetail).toBeVisible()
		await expect(sessionDetail).toContainText(
			`PP. ${session.fromPage}-${session.toPage}`,
		)

		await page.getByRole('button', { name: 'Close' }).click()
		await page.getByRole('button', { name: 'Next month' }).click()
		const currentMonthLabel = new Intl.DateTimeFormat('en-US', {
			month: 'long',
			year: 'numeric',
		}).format(today)
		await expect(
			page.getByRole('heading', { name: currentMonthLabel }),
		).toBeVisible()
		await expect(
			page.getByRole('button', {
				name: new RegExp(`${sessionDayLabel}.*has reading session`),
			}),
		).toHaveCount(0)
	},
)
