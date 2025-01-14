import { FC } from "react"

interface IProgressProps {
	progress: number
	togglePlay: () => void
}

export const Progress: FC<IProgressProps> = ({ progress, togglePlay }) => {
	return (
		<div className="absolute top-0 left-0 w-full h-full" onClick={togglePlay}>
			<svg viewBox="0 0 240 240" className="w-full h-full">
				<circle cx="120" cy="120" r="118" strokeWidth="4" fill="none" />
				<circle
					cx="120"
					cy="120"
					r="118"
					stroke="#e0e0e0"
					strokeWidth="4"
					fill="none"
					strokeDasharray={2 * Math.PI * 118}
					strokeDashoffset={2 * Math.PI * 118 * (1 - progress / 100)}
					style={{
						transition: "stroke-dashoffset 0.1s linear",
						transform: "rotate(-90deg)",
						transformOrigin: "center",
					}}
				/>
			</svg>
		</div>
	)
}
