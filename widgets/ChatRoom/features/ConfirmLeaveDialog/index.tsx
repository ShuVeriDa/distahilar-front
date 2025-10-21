"use client"

import { Button } from "@/shared"
import { UseLiveRoomApi } from "@/shared/hooks/useLiveRoom"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui/Dialog/dialog"
import { useTranslations } from "next-intl"
import { FC } from "react"

type Props = {
	open: boolean
	onOpenChange: (value: boolean) => void
	chatId: string
	liveApi: UseLiveRoomApi
	onCloseOverlay: () => void
}

export const ConfirmLeaveDialog: FC<Props> = ({
	open,
	onOpenChange,
	chatId,
	liveApi,
	onCloseOverlay,
}) => {
	const t = useTranslations("COMMON")

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-[#1A2026] border-white/10 text-white w-[300px]">
				<DialogHeader>
					<DialogTitle>{t("LEAVE_OR_STOP")}</DialogTitle>
				</DialogHeader>
				<DialogFooter className="">
					<div className="w-full flex items-center justify-end gap-2">
						<Button
							variant="clean"
							aria-label={t("LEAVE")}
							className=" text-white px-4 py-2 rounded-md"
							onClick={() => {
								onOpenChange(false)
								liveApi.leaveLive(chatId)
								onCloseOverlay()
							}}
						>
							{t("LEAVE")}
						</Button>
						<Button
							aria-label={t("STOP_LIVE")}
							variant="clean"
							className=" text-white px-4 py-2 rounded-md hover:text-blue-600"
							onClick={() => {
								onOpenChange(false)
								liveApi.stopLive(chatId)
							}}
						>
							{t("STOP_LIVE")}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
