import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/ui/Dialog/dialog"
import { FC } from "react"
import { IItem } from "../Links"

interface ILinkOfSheetProps {
	item: IItem
	onClick: () => void
}

export const LinkOfSheet: FC<ILinkOfSheetProps> = ({ item, onClick }) => {
	return (
		<Dialog>
			<DialogTrigger onClick={onClick}></DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="hidden"></DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
