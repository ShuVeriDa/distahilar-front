"use client"

import { MessageEnum } from "@/prisma/models"
import { Button, Typography } from "@/shared"
import dynamic from "next/dynamic"
import { FC } from "react"
import { PiInstagramLogoFill, PiMicrophoneFill } from "react-icons/pi"
import { RecordingTimer } from "../../shared/ui/RecordingTimer"

const MotionDiv = dynamic(() =>
	import("framer-motion").then(mod => mod.motion.div)
)

interface IRecorderProps {
	recording: boolean
	shadowColor: string
	glowIntensity: number
	recordingTime: number
	volume: number
	typeMessage: MessageEnum
	onCancel: () => void
}

export const Recorder: FC<IRecorderProps> = ({
	glowIntensity,
	recording,
	recordingTime,
	shadowColor,
	volume,
	typeMessage,
	onCancel,
}) => {
	return (
		<div className="w-full text-white rounded-lg pl-[13px]">
			<div className="flex items-center justify-between ">
				<RecordingTimer recordingTime={recordingTime} recording={recording} />

				<Button type="button" onClick={onCancel}>
					<Typography tag="p" className="text-[13px] text-[#40C5F6] font-[500]">
						Cancel
					</Typography>
				</Button>

				<div className="relative ">
					{recording && (
						<>
							<MotionDiv
								className="absolute -top-3 -left-3 rounded-full bg-blue-400 opacity-50"
								animate={{
									scale: [0.8, 1, 1.1],
									opacity: [0.5, 0.3, 0],
								}}
								transition={{
									duration: 1.2,
									repeat: Infinity,
									ease: "easeOut",
								}}
								style={{
									width: "70px",
									height: "70px",
								}}
							/>
							<MotionDiv
								className="absolute -top-3 -left-3 rounded-full bg-blue-400 opacity-50"
								animate={{
									scale: [0.8, 1.05, 1.15],
									opacity: [0.4, 0.2, 0],
								}}
								transition={{
									duration: 1.5,
									repeat: Infinity,
									ease: "easeOut",
									delay: 0.4,
								}}
								style={{
									width: "70px",
									height: "70px",
								}}
							/>
						</>
					)}

					<MotionDiv
						className="relative rounded-full"
						initial={{ scale: 1 }}
						animate={{
							scale: 1 + volume / 100,
							boxShadow: `0px 0px ${glowIntensity * 20}px ${shadowColor}`,
						}}
						transition={{
							type: "spring",
							stiffness: 100,
							damping: 10,
						}}
					>
						<Button
							variant="default"
							className="w-[47px] h-[47px] !pl-0.5 flex items-center justify-center bg-[#40A7E3] rounded-full"
							type="submit"
						>
							{typeMessage === MessageEnum.VOICE && (
								<PiMicrophoneFill size={26} className="fill-white" />
							)}
							{typeMessage === MessageEnum.VIDEO && (
								<PiInstagramLogoFill size={26} className="fill-white" />
							)}
						</Button>
					</MotionDiv>
				</div>
			</div>
		</div>
	)
}
