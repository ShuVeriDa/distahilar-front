import { Button, Typography } from "@/shared"
import { LiveParticipantType } from "@/shared/lib/services/call/call.types"
import { cn } from "@/shared/lib/utils/cn"
import Image from "next/image"
import { FC } from "react"
import { MdCallEnd } from "react-icons/md"
import { PiMicrophoneFill, PiMicrophoneSlashFill } from "react-icons/pi"

interface ILiveBannerJoinedProps {
	isSelfMuted: boolean
	participants: LiveParticipantType[]
	nameOfChat: string | undefined
	handleLeaveClick: () => void
	maximizeWindowsLive: () => void
}

export const LiveBannerJoined: FC<ILiveBannerJoinedProps> = ({
	isSelfMuted,
	participants,
	nameOfChat,
	handleLeaveClick,
	maximizeWindowsLive,
}) => {
	return (
		<Button variant="clean" onClick={maximizeWindowsLive}>
			<div className="w-full py-1.5 px-4 flex items-center justify-between live-gradient-animated dark:bg-[#17212B] border-b border-b-[#E7E7E7] dark:border-b-[#101921] dark:text-white">
				<div className="flex gap-2 items-center">
					<div>
						{isSelfMuted ? (
							<PiMicrophoneSlashFill size={24} />
						) : (
							<PiMicrophoneFill size={24} />
						)}
					</div>
					<div className="flex items-center -space-x-5 relative">
						{participants.map((p, index) => (
							<div
								key={p.userId}
								className={cn(
									"w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center text-sm font-medium shrink-0"
								)}
								style={{ zIndex: participants.length - index }}
							>
								<Image
									src={p?.imageUrl ?? "/images/no-avatar.png"}
									alt={p?.name ?? ""}
									width={28}
									height={28}
									className="rounded-full object-cover"
								/>
							</div>
						))}
					</div>
				</div>

				<div className="flex flex-col gap-0.5">
					<Typography
						tag="span"
						className="text-[13px] font-medium dark:text-white text-[#000000]"
					>
						{nameOfChat}
					</Typography>
				</div>
				<div role="button" tabIndex={0} onClick={handleLeaveClick}>
					<MdCallEnd size={24} className="text-white" />
				</div>
			</div>
		</Button>
	)
}
