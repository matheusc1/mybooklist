import { isHttpError } from '#/http/client'

export function throwWhenNoData(
	error: unknown,
	query: { state: { data: unknown } },
): boolean {
	const isUnauthorized = isHttpError(error) && error.status === 401
	return query.state.data === undefined && !isUnauthorized
}
