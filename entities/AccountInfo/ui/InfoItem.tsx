import { Button } from "@/shared/ui/Button"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FC } from "react"

export type IInfoItem = {
	id: number
	name: string
	icon: JSX.Element
	value: string
	onOpen: () => void
}

interface IInfoItemProps extends IInfoItem {}

export const InfoItem: FC<IInfoItemProps> = ({ icon, name, value, onOpen }) => {
	return (
		<Button
			className="w-full flex !justify-between items-center px-5 py-2 hover:bg-[#232E3C] hover:cursor-pointer"
			onClick={onOpen}
		>
			<div className="flex gap-5">
				<div>{icon}</div>
				<div>
					<Typography tag="p" className="text-[14px] font-normal">
						{name}
					</Typography>
				</div>
			</div>
			<div>
				<Typography tag="p" className="text-[14px] font-normal text-[#168ACD]">
					{value}
				</Typography>
			</div>
		</Button>
	)
}

