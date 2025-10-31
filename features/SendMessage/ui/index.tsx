"use client"

import { CircleVideoRecorder } from "@/features/CircleVideoRecorder/ui"
import { Recorder } from "@/features/Recorder"
import {
	FoundedChatsType,
	MessageEnum,
	MessageType,
	VoiceVideoMessageType,
} from "@/prisma/models"
import { useUser } from "@/shared"
import { useCircleVideoRecorder } from "@/shared/hooks/useCircleVideoRecorder"
import { useFileManager } from "@/shared/hooks/useFileManager"
import { useMessagePreviewText } from "@/shared/hooks/useMessagePreviewText"
import { useMessageRecorderHandlers } from "@/shared/hooks/useMessageRecorderHandlers"
import { useFileQuery } from "@/shared/lib/services/file/usefileQuery"
import {
	useEditMessage,
	useSendMessage,
} from "@/shared/lib/services/message/useMessagesQuery"
import { useVoiceRecord } from "@/widgets/ChatRoom/shared/hooks/useVoiceRecord"
import { ContentType } from "@/widgets/ChatRoom/ui/content-type"
import { $Enums } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query"
import { FC, useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

export interface IFormRichMessageInput {
	content: string
	voiceMessages: VoiceVideoMessageType[]
}

interface ISendMessageProps {
	chatId: string
	chatType: $Enums.ChatRole | undefined
	editedMessage: MessageType | null
	handleEditMessage: (message: MessageType | null) => void
	replyMessage?: MessageType | null
	handleReplyMessage?: (message: MessageType | null) => void
}

export const SendMessage: FC<ISendMessageProps> = ({
	chatId,
	chatType,
	editedMessage,
	handleEditMessage,
	replyMessage,
	handleReplyMessage,
}) => {
	const { user } = useUser()

	const [typeMessage, setTypeMessage] = useState<MessageEnum>(MessageEnum.TEXT)
	const { onAddFiles } = useFileManager(chatId, chatType, user?.id)

	const client = useQueryClient()

	const { register, handleSubmit, reset, watch, setValue } =
		useForm<IFormRichMessageInput>()
	const currentValue = watch("content")

	const { mutateAsync: sendMessage } = useSendMessage(
		chatId,
		chatType,
		user?.id
	)
	const { mutateAsync: editMessage } = useEditMessage(chatId)

	const replyPreviewText = useMessagePreviewText(
		replyMessage as unknown as FoundedChatsType["lastMessage"]
	)

	const { uploadFileQuery } = useFileQuery(
		typeMessage === MessageEnum.VIDEO ? "video-message" : "audio-message"
	)
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

	const {
		stream: cameraStream,
		recording: cameraRecording,
		recordingTime: cameraRecordingTime,
		shadowColor: cameraShadowColor,
		glowIntensity: cameraGlowIntensity,
		volume: cameraVolume,
		startRecording: cameraStartRecording,
		stopRecording: cameraStopRecording,
	} = useCircleVideoRecorder()

	const { handleVoiceSubmit, handleVideoSubmit } = useMessageRecorderHandlers({
		chatId,
		chatType,
		userId: user?.id,
		client,
		stopRecording,
		cameraStopRecording,
		audioUpload,
		sendMessage,
		reset,
		setTypeMessage,
	})

	useEffect(() => {
		if (
			editedMessage &&
			editedMessage.content &&
			editedMessage.messageType === MessageEnum.TEXT
		) {
			setValue("content", editedMessage.content)
		}
	}, [editedMessage, setValue])

	const manageVoiceRecording = () => {
		if (recording && typeMessage === MessageEnum.VOICE) {
			stopRecording()
			setTypeMessage(MessageEnum.TEXT)
		}

		if (!recording && typeMessage !== MessageEnum.VOICE) {
			startRecording()
			setTypeMessage(MessageEnum.VOICE)
		}
	}

	const manageVideoRecording = () => {
		if (cameraRecording && typeMessage === MessageEnum.VIDEO) {
			cameraStopRecording()
			setTypeMessage(MessageEnum.TEXT)
		}

		if (!cameraRecording) {
			cameraStartRecording()
			setTypeMessage(MessageEnum.VIDEO)
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
			...(replyMessage?.id ? { repliedToId: replyMessage.id } : {}),
		})
		if (handleReplyMessage) handleReplyMessage(null)
		reset()
	}

	const onCancel = () => {
		stopRecording()
		setTypeMessage(MessageEnum.TEXT)
	}

	const onSubmit: SubmitHandler<IFormRichMessageInput> = async data => {
		if (typeMessage === MessageEnum.TEXT) {
			if (editedMessage && editedMessage.content) {
				await editMessage({
					messageId: editedMessage.id,
					content: data.content,
				})
				handleEditMessage(null)
			} else {
				await handleTextSubmit(data.content)
			}

			reset()
			return
		}

		if (typeMessage === MessageEnum.VOICE) {
			await handleVoiceSubmit()

			reset()
			return
		}

		if (typeMessage === MessageEnum.VIDEO) {
			await handleVideoSubmit()

			reset()
			return
		}
	}

	return (
		<div className="w-full min-h-[47px] bg-white dark:bg-[#17212B] border-t border-t-[#E7E7E7] dark:border-t-[#101921] ">
			{replyMessage && (
				<div className="px-3 py-2 text-sm bg-black/5 dark:bg-white/5 flex items-center justify-between">
					<div className="truncate max-w-[80%]">{replyPreviewText}</div>
					<button
						type="button"
						onClick={() => handleReplyMessage && handleReplyMessage(null)}
						className="text-xs opacity-70 hover:opacity-100"
					>
						Cancel
					</button>
				</div>
			)}
			<form
				className="flex items-center justify-between"
				onSubmit={handleSubmit(onSubmit)}
			>
				{recording && typeMessage === MessageEnum.VOICE ? (
					<Recorder
						recording={recording}
						shadowColor={shadowColor}
						glowIntensity={glowIntensity}
						recordingTime={recordingTime}
						volume={volume}
						onCancel={onCancel}
						typeMessage={typeMessage}
					/>
				) : cameraRecording && typeMessage === MessageEnum.VIDEO ? (
					<CircleVideoRecorder
						stream={cameraStream}
						recordingTime={cameraRecordingTime}
						recording={cameraRecording}
						shadowColor={cameraShadowColor}
						glowIntensity={cameraGlowIntensity}
						volume={cameraVolume}
						typeMessage={typeMessage}
						stopRecording={cameraStopRecording}
					/>
				) : (
					<ContentType
						currentValue={currentValue}
						recording={recording}
						editedMessage={editedMessage}
						register={register}
						manageVoiceRecording={manageVoiceRecording}
						manageVideoRecording={manageVideoRecording}
						onAddEmoji={onAddEmoji}
						handleSubmit={handleSubmit}
						onSubmit={onSubmit}
						handleEditMessage={handleEditMessage}
						onAddFiles={onAddFiles}
					/>
				)}
			</form>
		</div>
	)
}
