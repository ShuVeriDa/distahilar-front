import { FC } from "react"
import { Button } from "../Button"
import { IconRenderer } from "../IconRenderer"
import { IconsRendererType } from "../IconRenderer/data"
import { Typography } from "../Typography/Typography"

const iconsList: IconsRendererType[] = [
	"Cat",
	"Book",
	"Coin",
	"Controller",
	"Bulb",
	"Like",
	"Music",
	"Brush",
	"Air",
	"Ball",
	"Star",
	"GraduationCap",
	"Telegram",
	"User",
	"Group",
	"AllChats",
	"Dialog",
	"Android",
	"Crown",
	"Flower",
	"Home",
	"Heart",
	"Mask",
	"Glass",
	"Chart",
	"BriefCase",
	"Bell",
	"Megaphone",
	"Folder",
	"Clipboard",
]

interface IChooseIconFolderProps {
	onChangeIcon: (icon: IconsRendererType) => void
}

export const ChooseIconFolder: FC<IChooseIconFolderProps> = ({
	onChangeIcon,
}) => {
	return (
		<div className="flex flex-col gap-3 p-4 w-[282px] rounded-[6px]  bg-[#17212B] border-[1px] border-[#18222d]">
			<Typography tag="h5" className="text-[14px] font-normal text-[#5C6E81]">
				Choose an icon
			</Typography>

			<div className="flex flex-wrap items-center justify-start gap-4 ">
				{iconsList.map((icon, index) => {
					const onClickHandler = () => {
						onChangeIcon(icon)
					}
					return (
						<Button key={index} className="group" onClick={onClickHandler}>
							<IconRenderer
								iconName={icon}
								className="w-[28px] h-[28px] [&>path]:fill-[#3E546A] group-hover:[&>path]:fill-[#40A7E3]"
							/>
						</Button>
					)
				})}
			</div>
		</div>
	)
}
