export const API_URL = import.meta.env.VITE_API_URL

export interface HttpError {
	status: number
	message: string
}

export function isHttpError(error: unknown): error is HttpError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'status' in error &&
		'message' in error
	)
}

export async function buildHttpError(response: Response): Promise<HttpError> {
	const errorBody = await response.json().catch(() => null)

	return {
		status: response.status,
		message: errorBody?.message ?? response.statusText,
	}
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
	params?: Record<string, string | number | boolean | undefined>
	body?: unknown
}

async function request<T>(
	path: string,
	options: RequestOptions = {},
): Promise<T> {
	const { params, body, headers, ...init } = options

	const url = new URL(path, API_URL)
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined) url.searchParams.set(key, String(value))
		}
	}

	const response = await fetch(url, {
		...init,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
		body: body !== undefined ? JSON.stringify(body) : undefined,
	})

	if (!response.ok) {
		throw await buildHttpError(response)
	}

	if (response.status === 204) {
		return undefined as T
	}

	return response.json()
}

export const httpClient = {
	get: <T>(path: string, params?: RequestOptions['params']) =>
		request<T>(path, { method: 'GET', params }),

	post: <T>(path: string, body?: unknown) =>
		request<T>(path, { method: 'POST', body }),

	patch: <T>(path: string, body?: unknown) =>
		request<T>(path, { method: 'PATCH', body }),

	delete: <T>(path: string, params?: RequestOptions['params']) =>
		request<T>(path, { method: 'DELETE', params }),
}
