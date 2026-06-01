import { LucideStar } from 'lucide-react'
import { useState } from 'react'

interface RatingStarsProps {
	value?: number
	onChange?: (value: number) => void
}

export function RatingStars({ value, onChange }: RatingStarsProps) {
	const [internalRating, setInternalRating] = useState(0)
	const [hovered, setHovered] = useState(0)

	const rating = value ?? internalRating
	const active = hovered || rating

	function handleClick(star: number) {
		if (value === undefined) {
			setInternalRating(star)
		}

		onChange?.(star)
	}

	return (
		<fieldset className="flex gap-1.5" onMouseLeave={() => setHovered(0)}>
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					key={star}
					type="button"
					aria-label={`${star} star${star > 1 ? 's' : ''}`}
					onClick={() => handleClick(star)}
					onMouseEnter={() => setHovered(star)}
					className="cursor-pointer border-none bg-transparent p-0.5 leading-none transition-[color,transform] duration-100 hover:scale-115"
				>
					<LucideStar
						className={`size-5 transition-[fill,color] duration-100 ${star <= active ? 'fill-accent text-accent' : 'fill-surface3 text-transparent'}`}
					/>
				</button>
			))}
		</fieldset>
	)
}
