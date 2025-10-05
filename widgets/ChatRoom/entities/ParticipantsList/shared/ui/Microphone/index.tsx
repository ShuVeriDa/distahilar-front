import { FC } from "react"
import { BiSolidMicrophone, BiSolidMicrophoneOff } from "react-icons/bi"

interface IMicrophoneProps {
	isSelfMuted: boolean
	micOn: boolean
	participantUserId: string
	userId: string | undefined
}

export const Microphone: FC<IMicrophoneProps> = ({
	isSelfMuted,
	micOn,
	participantUserId,
	userId,
}) => {
	return (
		<div className="flex items-center gap-2">
			{(participantUserId === (userId || "") ? !isSelfMuted : micOn) ? (
				<BiSolidMicrophone size={18} className="text-white" />
			) : (
				<BiSolidMicrophoneOff size={18} className="text-white/60" />
			)}
		</div>
	)
}
