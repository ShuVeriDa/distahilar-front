import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { ThemeToggle } from "@/shared/ui/Theme"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FC } from "react"
import { IItem } from "../.."

interface ILinkProps {
	item: IItem
	tag: "div" | "button"
	onClick: () => void
}

export const Link: FC<ILinkProps> = ({ item, tag, onClick }) => {
	const Component = tag

	return (
		<Component
			className="group flex px-4 h-[34px] rounded-[3px] justify-between items-center cursor-pointer dark:hover:bg-[#292d35] hover:bg-[rgba(0,0,0,0.6)] relative"
			onClick={onClick}
		>
			<div className="flex gap-3">
				<div>{item.icon}</div>

				<Typography tag="p" className="text-[14px] group-hover:text-white">
					{item.name}
				</Typography>
			</div>

			<div className="w-[3px] h-[16px] group-hover:bg-[#60cdff] rounded-full absolute left-0" />

			{item.type === EnumModel.NO_TYPE && <ThemeToggle />}
		</Component>
	)
}
