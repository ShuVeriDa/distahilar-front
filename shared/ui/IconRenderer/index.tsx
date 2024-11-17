import { FC } from "react"
import { iconList, IconsRendererType } from "./data"

interface IIconRendererProps {
	iconName: IconsRendererType | string
	className?: string
}

export const IconRenderer: FC<IIconRendererProps> = ({
	iconName,
	className,
}) => {
	const IconComponent = iconList.find(icon => icon.name === iconName)?.icon

	return IconComponent ? <IconComponent className={className} /> : null
}
