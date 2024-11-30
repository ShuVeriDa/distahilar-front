import { ChooseIconFolder } from "@/shared/ui/ChooseIconFolder"
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/shared/ui/HoverCard/hover-card"
import { IconRenderer } from "@/shared/ui/IconRenderer"
import { IconsRendererType } from "@/shared/ui/IconRenderer/data"
import { FC } from "react"

interface IHoverCardWrapperProps {
	iconUrl: string | null | undefined
	onChangeIcon: (icon: IconsRendererType) => void
}

export const HoverCardWrapper: FC<IHoverCardWrapperProps> = ({
	iconUrl,
	onChangeIcon,
}) => {
	return (
		<div className="absolute z-[1] right-0 top-[20px] cursor-pointer">
			<HoverCard openDelay={100} closeDelay={100}>
				<HoverCardTrigger className="group">
					<IconRenderer
						iconName={iconUrl ? (iconUrl as string) : "Folder"}
						className="w-[25px] h-[25px] [&>path]:fill-[#3E546A] group-hover:[&>path]:fill-[#40A7E3]"
					/>
				</HoverCardTrigger>
				<HoverCardContent className="border-none p-0 mr-6" align="end">
					<ChooseIconFolder onChangeIcon={onChangeIcon} />
				</HoverCardContent>
			</HoverCard>
		</div>
	)
}
