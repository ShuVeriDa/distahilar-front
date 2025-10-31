import { useModal } from "@/shared/hooks/useModal"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"

import { FC } from "react"
import { SheetLink } from "./Link"

interface ISheetLinksProps {
	closeSheet?: () => void
	items: IItem[]
	variant: "settings" | "sheet"
	ref?: React.RefObject<HTMLDivElement>
}

export type IItem = {
	name: string
	icon: React.ReactNode
	type: EnumModel
}

export const SheetLinks: FC<ISheetLinksProps> = ({
	closeSheet,
	items,
	variant = "sheet",
	ref,
}) => {
	const { onOpenModal } = useModal()

	const onClickModal = (type: EnumModel) => {
		if (type === EnumModel.NO_TYPE || type === EnumModel.LANGUAGE) return

		onOpenModal(type)

		if (closeSheet) {
			closeSheet()
		}
	}

	return (
		<div className="p-[5px] flex flex-col">
			{items.map((item, index) => (
				<SheetLink
					key={index}
					ref={ref}
					item={item}
					onClick={() => onClickModal(item.type)}
					tag={
						item.type === EnumModel.NO_TYPE || item.type === EnumModel.LANGUAGE
							? "div"
							: "button"
					}
					variant={variant}
				/>
			))}
		</div>
	)
}
