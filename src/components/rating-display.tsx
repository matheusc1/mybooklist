import { LucideStar } from 'lucide-react'

interface RatingDisplayProps {
	value?: number | null
	size?: 'small' | 'default'
}

export function RatingDisplay({ value, size = 'default' }: RatingDisplayProps) {
	const starSize = size === 'small' ? 'size-3' : 'size-5'

	return (
		<div
			className="flex"
			role="img"
			aria-label={`Rating: ${value ?? 0} out of 5 stars`}
		>
			{[1, 2, 3, 4, 5].map((star) => (
				<LucideStar
					key={star}
					aria-hidden="true"
					className={`${starSize} ${
						star <= (value ?? 0)
							? 'fill-accent text-transparent'
							: 'fill-surface3 text-transparent'
					}`}
				/>
			))}
		</div>
	)
}
