import { MessageEnum, MessageStatus, MessageType } from "@/prisma/models"
import { IFormRichMessageInput } from "@/widgets/ChatRoom/features/RichMessageInput"
import { $Enums } from "@prisma/client"
import {
	MutateOptions,
	QueryClient,
	UseMutateAsyncFunction,
} from "@tanstack/react-query"
import { UseFormReset } from "react-hook-form"
import { CreateMessageDto } from "../lib/services/message/useMessagesQuery"
import { generateTemporaryId } from "../lib/utils/generateTemporaryId"

interface IParams {
	chatId: string
	userId: string | undefined
	chatType: $Enums.ChatRole | undefined
	client: QueryClient
	audioUpload: UseMutateAsyncFunction<
		{
			url: string
			size: number
			duration?: number
		}[],
		Error,
		FormData,
		unknown
	>
	sendMessage: (
		variables: CreateMessageDto,
		options?: MutateOptions<void, Error, CreateMessageDto, unknown> | undefined
	) => Promise<void>
	reset: UseFormReset<IFormRichMessageInput>
	stopRecording: () => Promise<Blob | null>
	cameraStopRecording: () => Promise<Blob | null>
	setTypeMessage: (type: MessageEnum) => void // 💥 добавлено
}

export const useMessageRecorderHandlers = ({
	chatId,
	chatType,
	userId,
	client,
	audioUpload,
	sendMessage,
	reset,
	cameraStopRecording,
	stopRecording,
	setTypeMessage,
}: IParams) => {
	const tempId = generateTemporaryId()

	const addToCache = (message: MessageType) => {
		client.setQueryData(
			["messagesWS", chatId],
			(oldData: { messages: MessageType[]; nextCursor: string | null }) => {
				if (oldData.messages.some((msg: MessageType) => msg.id === tempId)) {
					return oldData
				}

				return {
					...oldData,
					messages: [...oldData.messages, message],
				}
			}
		)
	}

	const uploadAndSend = async (
		blob: Blob | null,
		fileName: string,
		messageType: MessageEnum
	) => {
		if (!blob) return
		const formData = new FormData()
		formData.append("files", blob, fileName)

		const optimisticMessage = {
			id: tempId,
			messageType,
			status: MessageStatus.PENDING,
			userId,
			chatType,
			createdAt: new Date().toISOString(),
		}

		addToCache(optimisticMessage as unknown as MessageType)

		try {
			const audio = await audioUpload(formData)
			console.log({ audio })

			await sendMessage({
				content: fileName.split(".")[0],
				messageType,
				url: audio[0].url,
				size: audio[0].size,
				duration: audio[0].duration,
			})
		} catch (err) {
			console.error("Ошибка отправки файлов:", err)
		} finally {
			setTypeMessage(MessageEnum.TEXT)
			reset()
		}
	}

	return {
		handleVoiceSubmit: async () =>
			await uploadAndSend(
				await stopRecording(),
				"audio-message.webm",
				MessageEnum.VOICE
			),

		handleVideoSubmit: async () =>
			await uploadAndSend(
				await cameraStopRecording(),
				"video-message.webm",
				MessageEnum.VIDEO
			),
	}
}
