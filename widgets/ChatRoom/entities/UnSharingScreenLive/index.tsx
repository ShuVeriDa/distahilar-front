import { Typography } from "@/shared"
import { UseLiveRoomApi } from "@/shared/hooks/useLiveRoom"
import { LiveParticipantType } from "@/shared/lib/services/call/call.types"
import { cn } from "@/shared/lib/utils/cn"
import { useTranslations } from "next-intl"
import { FC } from "react"
import { LiveControls } from "../../features/LiveControls"
import { HeaderOfLiveStream } from "../HeaderOfLiveStream"
import { ParticipantsList } from "../ParticipantsList"

interface IUnSharingScreenLiveProps {
	statusText: string
	description: string
	liveApi: UseLiveRoomApi
	title: string | undefined
	isLive: boolean | undefined
	isScreenSharing: boolean | undefined
	isSelfVideoOff: boolean | undefined
	isVideoOff: boolean | undefined
	isSelfMuted: boolean
	participants: LiveParticipantType[]
	remoteStreams: Map<string, MediaStream>
	handleLeaveClick: () => void
	handleMinimize: () => void
}

export const UnSharingScreenLive: FC<IUnSharingScreenLiveProps> = ({
	title,
	description,
	statusText,
	isLive,
	isScreenSharing,
	isVideoOff,
	isSelfVideoOff,
	isSelfMuted,
	participants,
	remoteStreams,
	liveApi,
	handleLeaveClick,
	handleMinimize,
}) => {
	const t = useTranslations("COMMON")
	return (
		<div
			className={cn(
				"relative flex flex-col mx-10 justify-between border border-white/10 w-full max-w-[430px] h-full max-h-[580px] rounded-lg overflow-hidden bg-[#1A2026]"
				// !isVideoOff && "max-h-[calc(100vh-40px)] h-auto"
			)}
		>
			<HeaderOfLiveStream
				title={title}
				description={description}
				statusText={statusText}
			/>

			<div
				className={cn(
					"overflow-y-auto telegram-scrollbar px-3.5 py-0.5",
					isVideoOff && "flex-1"
				)}
			>
				{isLive ? (
					<div className="flex flex-col gap-1">
						<ParticipantsList
							participants={participants}
							remoteStreams={remoteStreams}
							isSelfMuted={isSelfMuted}
							isScreenSharing={isScreenSharing}
							userId={undefined}
						/>
					</div>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<Typography tag="span" className="text-white/70 text-[15px]">
							{t("NO_LIVE_SESSION")}
						</Typography>
					</div>
				)}
			</div>

			<LiveControls
				isSelfVideoOff={isSelfVideoOff}
				isSelfMuted={isSelfMuted}
				onToggleVideo={liveApi.toggleSelfVideo}
				onToggleMute={liveApi.toggleSelfMute}
				onLeave={handleLeaveClick}
				isScreenSharing={isScreenSharing}
				onToggleScreenShare={liveApi.toggleScreenShare}
				handleMinimize={handleMinimize}
			/>
		</div>
	)
}
