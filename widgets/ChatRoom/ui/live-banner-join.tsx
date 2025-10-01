import { Button, Typography } from "@/shared"
import { LiveParticipantType } from "@/shared/lib/services/call/call.types"
import { cn } from "@/shared/lib/utils/cn"
import Image from "next/image"
import { FC } from "react"

interface ILiveBannerJoinProps {
	participants: LiveParticipantType[]
	joinLive: () => void
}

export const LiveBannerJoin: FC<ILiveBannerJoinProps> = ({
	participants,
	joinLive,
}) => {
	return (
		<div className="w-full py-2 px-4 flex items-center justify-between bg-[#FFFFFF] dark:bg-[#17212B] border-b border-b-[#E7E7E7] dark:border-b-[#101921] dark:text-white">
			<div className="flex flex-col gap-0.5">
				<Typography tag="span" className="text-[13px] font-medium text-white ">
					Live Stream
				</Typography>
				<Typography tag="span" className="text-[13px] text-[#999999]">
					{participants.length} participant
				</Typography>
			</div>
			<div className="flex items-center -space-x-5 relative">
				{participants.map((p, index) => (
					<div
						key={p.userId}
						className={cn(
							"w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center text-sm font-medium border-2 border-white dark:border-[#17212B] shrink-0"
						)}
						style={{ zIndex: participants.length - index }}
					>
						<Image
							src={p?.imageUrl ?? "/images/no-avatar.png"}
							alt={p?.name ?? ""}
							width={40}
							height={40}
							className="rounded-full object-cover"
						/>
					</div>
				))}
			</div>
			<Button
				variant="default"
				className="bg-[#3DA0DA] dark:bg-[#168ADE] font-medium text-white text-[14px] px-4 py-1 rounded-3xl"
				onClick={joinLive}
			>
				JOIN
			</Button>
		</div>
	)
}
