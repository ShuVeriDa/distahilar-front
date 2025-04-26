"use client"

import { MessageEnum, VoiceVideoMessageType } from "@/prisma/models"
import { useSendMessage } from "@/shared/lib/services/message/useMessagesQuery"
import { FC, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useVoiceRecord } from "../../shared/hooks/useVoiceRecord"
import { ContentType } from "../../ui/content-type"
import { VoiceRecorder } from "../VoiceRecorder"

export interface IFormRichMessageInput {
	content: string
	voiceMessages: VoiceVideoMessageType[]
}

interface IRichMessageInputProps {
	chatId: string
}

export const RichMessageInput: FC<IRichMessageInputProps> = ({ chatId }) => {
	const [typeMessage, setTypeMessage] = useState<MessageEnum>(MessageEnum.TEXT)

	const {
		mutateAsync: sendMessage,
		isLoading,
		isPending,
		isSuccess,
	} = useSendMessage(chatId)

	const {
		audioUrl,
		recording,
		shadowColor,
		glowIntensity,
		recordingTime,
		volume,
		mediaRecorder,
		startRecording,
		stopRecording,
	} = useVoiceRecord()

	const { register, handleSubmit, reset, watch, setValue } =
		useForm<IFormRichMessageInput>()

	const currentValue = watch("content")

	const onChangeTypeMessage = () => {
		if (typeMessage === MessageEnum.VOICE) {
			setTypeMessage(MessageEnum.VIDEO)
		} else {
			setTypeMessage(MessageEnum.VOICE)
		}
	}

	const manageRecording = () => {
		if (recording && typeMessage === MessageEnum.VOICE) {
			stopRecording()
		}
		if (!recording && typeMessage === MessageEnum.VOICE) {
			startRecording()
		}
	}

	const onAddEmoji = (icon: string) => {
		const currentValue = watch("content")
		setValue("content", currentValue + icon, { shouldValidate: true })
	}

	const onSendVoice = () => {
		stopRecording()
		console.log({ mediaRecorder, audioUrl })
	}

	const onSubmit: SubmitHandler<IFormRichMessageInput> = async data => {
		console.log({ data })
		console.log("manageRecording", { mediaRecorder })

		if (typeMessage === MessageEnum.TEXT) {
			await sendMessage({
				content: data.content,
				messageType: MessageEnum.TEXT,
			})
		}

		if (typeMessage === MessageEnum.VOICE) {
		}

		if (typeMessage === MessageEnum.VIDEO) {
		}

		reset()
	}

	return (
		<div className="w-full min-h-[47px] bg-white dark:bg-[#17212B] border-t border-t-[#E7E7E7] dark:border-t-[#101921] relative">
			<form
				className="flex items-center justify-between"
				onSubmit={handleSubmit(onSubmit)}
			>
				{recording && typeMessage === MessageEnum.VOICE ? (
					<VoiceRecorder
						recording={recording}
						shadowColor={shadowColor}
						glowIntensity={glowIntensity}
						recordingTime={recordingTime}
						volume={volume}
						stopRecording={onSendVoice}
					/>
				) : (
					<ContentType
						typeMessage={typeMessage}
						currentValue={currentValue}
						recording={recording}
						register={register}
						onChangeTypeMessage={onChangeTypeMessage}
						manageRecording={manageRecording}
						onAddEmoji={onAddEmoji}
						handleSubmit={handleSubmit}
						onSubmit={onSubmit}
					/>
				)}
			</form>
		</div>
	)
}
