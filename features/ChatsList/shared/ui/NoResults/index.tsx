import { Typography } from "@/shared"
import { FC } from "react"

interface INoResultsProps {
	query: string
}

export const NoResults: FC<INoResultsProps> = ({ query }) => {
	return (
		<div className="w-full flex flex-col justify-center items-center p-2">
			<Typography tag="h6" className="text-[#677A8B] text-center">
				No Results
			</Typography>
			<Typography tag="p" className="text-[#677A8B] text-center">
				{`There were no results for "${query}"`}
			</Typography>
		</div>
	)
}
