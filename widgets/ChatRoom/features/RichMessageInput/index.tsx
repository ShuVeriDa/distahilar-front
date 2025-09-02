"use client"

import { CircleVideoRecorder } from "@/features/CircleVideoRecorder/ui"
import {
	MessageEnum,
	MessageType,
	VoiceVideoMessageType,
} from "@/prisma/models"
import { useUser } from "@/shared"
import { useCircleVideoRecorder } from "@/shared/hooks/useCircleVideoRecorder"
import { useFileManager } from "@/shared/hooks/useFileManager"
import { useMessageRecorderHandlers } from "@/shared/hooks/useMessageRecorderHandlers"
import { useFileQuery } from "@/shared/lib/services/file/usefileQuery"
import {
	useEditMessage,
	useSendMessage,
} from "@/shared/lib/services/message/useMessagesQuery"
import { $Enums } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query"
import { FC, useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useVoiceRecord } from "../../shared/hooks/useVoiceRecord"
import { ContentType } from "../../ui/content-type"
import { Recorder } from "../Recorder"

export interface IFormRichMessageInput {
	content: string
	voiceMessages: VoiceVideoMessageType[]
}

interface IRichMessageInputProps {
	chatId: string
	chatType: $Enums.ChatRole | undefined
	editedMessage: MessageType | null
	handleEditMessage: (message: MessageType | null) => void
}

export const RichMessageInput: FC<IRichMessageInputProps> = ({
	chatId,
	chatType,
	editedMessage,
	handleEditMessage,
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
			console.log("if:true")

			cameraStopRecording()
			setTypeMessage(MessageEnum.TEXT)
		}

		if (!cameraRecording) {
			console.log("if:false")

			cameraStartRecording()
			setTypeMessage(MessageEnum.VIDEO)
		}
		console.log({ cameraRecording })
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
	// relative
	return (
		<div className="w-full min-h-[47px] bg-white dark:bg-[#17212B] border-t border-t-[#E7E7E7] dark:border-t-[#101921] ">
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
