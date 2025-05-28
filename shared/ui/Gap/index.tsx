import { FC } from "react"

interface IGapProps {}

export const Gap: FC<IGapProps> = () => {
	return (
		<div className="h-2.5 bg-[#F1F1F1] dark:bg-[#232E3C] shadow-inner-top-bottom" />
	)
}
