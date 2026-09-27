import { API_URL } from './fixtures/api'

export default async function globalSetup() {
	const maxAttempts = 10
	const delayMs = 1000

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			const response = await fetch(`${API_URL}/health`)
			if (response.ok) return
		} catch {
			// API not listening yet, keep retrying
		}

		if (attempt === maxAttempts) {
			throw new Error(
				`API at ${API_URL} did not become healthy after ${maxAttempts} attempts. ` +
					'Make sure it is running (npm run start:e2e in mybooklist-api).',
			)
		}

		await new Promise((resolve) => setTimeout(resolve, delayMs))
	}
}
