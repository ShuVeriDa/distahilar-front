import { ChooseLanguage } from "@/entities/ChooseLanguage"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { cn } from "@/shared/lib/utils/cn"
import { ThemeToggle } from "@/shared/ui/Theme"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FC } from "react"
import { IItem } from "../.."

export const LinkNS = {
	variant: {
		sheet: {
			className: "h-[34px]",
		},
		settings: {
			className: "h-10",
		},
	},
}

interface ILinkProps {
	item: IItem
	tag: "div" | "button"
	variant: "settings" | "sheet"
	ref?: React.RefObject<HTMLDivElement>
	onClick: () => void
}

export const Link: FC<ILinkProps> = ({ item, tag, onClick, variant, ref }) => {
	const ROOT_CLASSNAME = LinkNS.variant[variant].className

	const Component = tag

	return (
		<Component
			className={cn(
				"group flex px-4  rounded-[3px] justify-between items-center cursor-pointer hover:bg-[rgba(0,0,0,0.1)] hover:dark:bg-[#232E3C] relative",
				ROOT_CLASSNAME
			)}
			onClick={onClick}
		>
			<div className="flex gap-3">
				<div>{item.icon}</div>

				<Typography tag="p" className="text-[14px]">
					{item.name}
				</Typography>
			</div>

			{variant === "sheet" && (
				<div className="w-[3px] h-[16px] group-hover:bg-[#60cdff] rounded-full absolute left-0" />
			)}

			{item.type === EnumModel.NO_TYPE && <ThemeToggle />}
			{item.type === EnumModel.LANGUAGE && <ChooseLanguage ref={ref} />}
		</Component>
	)
}
