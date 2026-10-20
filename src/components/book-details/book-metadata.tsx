import type { ReactNode } from 'react'
import { formatBookDate } from '#/utils/format-date'

interface BookMetadataProps {
	startedAt: string | null
	completedAt: string | null
	elapsedDays: number | null
	showTimeTaken: boolean
}

function MetadataItem({
	label,
	children,
}: {
	label: string
	children: ReactNode
}) {
	return (
		<div>
			<dt className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted">
				{label}
			</dt>
			<dd className="text-sm">{children}</dd>
		</div>
	)
}

export function BookMetadata({
	startedAt,
	completedAt,
	elapsedDays,
	showTimeTaken,
}: BookMetadataProps) {
	if (!startedAt && !completedAt && elapsedDays === null) return null

	return (
		<dl className="flex flex-wrap gap-x-8 gap-y-3">
			{startedAt && (
				<MetadataItem label="Started">{formatBookDate(startedAt)}</MetadataItem>
			)}
			{completedAt && (
				<MetadataItem label="Finished">
					{formatBookDate(completedAt)}
				</MetadataItem>
			)}
			{elapsedDays !== null && showTimeTaken && (
				<MetadataItem label="Time Taken">
					{elapsedDays} {elapsedDays === 1 ? 'day' : 'days'}
				</MetadataItem>
			)}
		</dl>
	)
}
