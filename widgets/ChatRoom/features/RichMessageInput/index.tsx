"use client"

import { MessageEnum, VoiceVideoMessageType } from "@/prisma/models"
import { useFileQuery } from "@/shared/lib/services/file/usefileQuery"
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

	const { register, handleSubmit, reset, watch, setValue } =
		useForm<IFormRichMessageInput>()
	const { mutateAsync: sendMessage } = useSendMessage(chatId)
	const { uploadFileQuery } = useFileQuery("audio-message")
	const { mutateAsync: audioUpload } = uploadFileQuery

	const {
		recording,
		shadowColor,
		glowIntensity,
		recordingTime,
		volume,
		startRecording,
		stopRecording,
	} = useVoiceRecord()

	const currentValue = watch("content")

	const manageRecording = () => {
		if (recording && typeMessage === MessageEnum.VOICE) {
			stopRecording()
			setTypeMessage(MessageEnum.TEXT)
		}

		if (!recording && typeMessage !== MessageEnum.VOICE) {
			startRecording()
			setTypeMessage(MessageEnum.VOICE)
		}
	}

	const onAddEmoji = (icon: string) => {
		const currentValue = watch("content")
		setValue("content", currentValue + icon, { shouldValidate: true })
	}

	const handleTextSubmit = async (content: string) => {
		await sendMessage({
			content,
			messageType: MessageEnum.TEXT,
		})

		reset()
	}

	const handleVoiceSubmit = async () => {
		const blob = await stopRecording()
		if (!blob) return

		try {
			const formData = new FormData()
			formData.append("file", blob, "audio-message.webm")

			const { size, url, duration } = await audioUpload(formData)

			await sendMessage({
				content: "audio-message",
				messageType: MessageEnum.VOICE,
				url,
				size,
				duration,
			})
		} catch (err) {
			console.error("Ошибка загрузки аудио:", err)
		} finally {
			setTypeMessage(MessageEnum.TEXT)

			reset()
		}
	}

	const onSubmit: SubmitHandler<IFormRichMessageInput> = async data => {
		if (typeMessage === MessageEnum.TEXT) {
			await handleTextSubmit(data.content)
			return
		}

		if (typeMessage === MessageEnum.VOICE) {
			await handleVoiceSubmit()
			return
		}

		if (typeMessage === MessageEnum.VIDEO) {
			reset()
			return
		}
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
						stopRecording={stopRecording}
					/>
				) : (
					<ContentType
						currentValue={currentValue}
						recording={recording}
						register={register}
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
