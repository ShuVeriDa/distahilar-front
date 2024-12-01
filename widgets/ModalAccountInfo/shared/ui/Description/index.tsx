import { FC } from "react"

interface IDescriptionProps {
	text: string
	splitWord?: string
}

export const Description: FC<IDescriptionProps> = ({ text, splitWord }) => {
	const parts = text.split(splitWord!)

	return (
		<div className="bg-[#232E3C] px-5 py-2 text-[13px] font-normal text-[#708499]">
			{splitWord ? (
				<>
					<span>{parts[0]}</span>
					<br />
					<span>Example:{parts[1]}</span>
				</>
			) : (
				<span>{text}</span>
			)}
		</div>
	)
}
