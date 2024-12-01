import { Button } from "@/shared/ui/Button"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FC } from "react"

export type IInfoItem = {
	id: number
	name: string
	icon: JSX.Element
	value: string
}

interface IInfoItemProps extends IInfoItem {}

export const InfoItem: FC<IInfoItemProps> = ({ icon, name, value }) => {
	return (
		<Button className="w-full flex !justify-between items-center px-5 py-2 hover:bg-[#232E3C] hover:cursor-pointer">
			<div className="flex gap-5">
				<div>{icon}</div>
				<div>
					<Typography tag="p" className="text-[14px] font-normal">
						{name}
					</Typography>
				</div>
			</div>
			<div>
				<Typography tag="p" className="text-[14px] font-normal text-[#6AB3F3]">
					{value}
				</Typography>
			</div>
		</Button>
	)
}