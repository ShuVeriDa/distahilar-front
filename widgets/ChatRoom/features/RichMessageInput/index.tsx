"use client"

import {
	MessageEnum,
	MessageStatus,
	MessageType,
	VoiceVideoMessageType,
} from "@/prisma/models"
import { useUser } from "@/shared"
import { useFileQuery } from "@/shared/lib/services/file/usefileQuery"
import { useSendMessage } from "@/shared/lib/services/message/useMessagesQuery"
import { generateTemporaryId } from "@/shared/lib/utils/generateTemporaryId"
import { $Enums } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query"
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
	chatType: $Enums.ChatRole | undefined
}

export const RichMessageInput: FC<IRichMessageInputProps> = ({
	chatId,
	chatType,
}) => {
	const [typeMessage, setTypeMessage] = useState<MessageEnum>(MessageEnum.TEXT)
	const { user } = useUser()

	const { register, handleSubmit, reset, watch, setValue } =
		useForm<IFormRichMessageInput>()
	const { mutateAsync: sendMessage } = useSendMessage(
		chatId,
		chatType,
		user?.id
	)
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

	const onCancel = () => {
		stopRecording()
		setTypeMessage(MessageEnum.TEXT)
	}

	const client = useQueryClient()

	const handleVoiceSubmit = async () => {
		const blob = await stopRecording()
		if (!blob) return

		try {
			const formData = new FormData()
			formData.append("file", blob, "audio-message.webm")

			const formatDataAudio = formData.get("file")

			console.log({ formData, formatDataAudio })

			const optimisticMessage = {
				id: generateTemporaryId(),
				messageType: MessageEnum.VOICE,
				status: MessageStatus.PENDING,
				userId: user?.id,
				chatType: chatType,
				createdAt: new Date().toISOString(),
			}

			client.setQueryData(
				["messagesWS", chatId],
				(oldData: { messages: MessageType[]; nextCursor: string | null }) => {
					if (
						oldData.messages.some(
							(msg: MessageType) => msg.id === generateTemporaryId()
						)
					) {
						return oldData
					}

					return {
						...oldData,
						messages: [...oldData.messages, optimisticMessage],
					}
				}
			)

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
						onCancel={onCancel}
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
