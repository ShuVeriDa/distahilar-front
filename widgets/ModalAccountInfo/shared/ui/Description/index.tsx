import { cn } from "@/shared/lib/utils/cn"
import { FC } from "react"

interface IDescriptionProps {
	text: string
	splitWord?: string
}

export const Description: FC<IDescriptionProps> = ({ text, splitWord }) => {
	const parts = text.split(splitWord!)

	return (
		<div
			className={cn(
				"relative bg-[#F1F1F1] text-[#999999] dark:bg-[#232E3C] px-5 py-2 text-[13px] !font-[400] dark:text-[#708499]",
				"shadow-inner-top-bottom"
			)}
		>
			{splitWord ? (
				<>
					<span>{parts[0]}</span>
					<br />
					{splitWord === "You can user" && <br />}
					<span>
						{splitWord}:{parts[1]}
					</span>
				</>
			) : (
				<span>{text}</span>
			)}
		</div>
	)
}
