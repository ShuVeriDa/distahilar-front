import { MessageEnum, MessageStatus, MessageType } from "@/prisma/models"
import { useFileQuery } from "@/shared/lib/services/file/usefileQuery"
import { useSendMessage } from "@/shared/lib/services/message/useMessagesQuery"
import { generateTemporaryId } from "@/shared/lib/utils/generateTemporaryId"
import { getTypeOfMedia } from "@/shared/lib/utils/getTypeOfMedia"
import { $Enums } from "@prisma/client"
import { InfiniteData, useQueryClient } from "@tanstack/react-query"
import { ChangeEvent, useRef, useState } from "react"

export const useModelFileManager = (
	addedFiles: File[] | undefined,
	chatId: string | undefined,
	chatType: $Enums.ChatRole | undefined,
	userId: string | undefined,
	onClearAddedFiles: () => void | undefined,
	onClose: () => void
) => {
	const [comment, setComment] = useState<string | null>(null)
	const [files, setFiles] = useState<File[]>(addedFiles ?? [])
	const fileInputRef = useRef<HTMLInputElement>(null)
	const lengthIs10 = files.length === 10

	const onOpenInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
	}

	const onChangeComment = (e: ChangeEvent<HTMLInputElement>) => {
		setComment(e.currentTarget.value)
	}

	const onAddFiles = (e: ChangeEvent<HTMLInputElement>) => {
		const fileValue = e.currentTarget.files
		if (fileValue) {
			const newFiles = Array.from(fileValue)
			const availableSlots = 10 - files.length
			const filesToAdd = newFiles.slice(0, availableSlots)

			if (filesToAdd.length > 0) {
				setFiles(prev => [...prev, ...filesToAdd])
			}
		}
	}

	const onClearFiles = () => {
		setFiles([])
		onClearAddedFiles()
	}
	const onDeleteFile = (index: number) => {
		setFiles(prev => prev.filter((_, i) => i !== index))
	}

	const onCloseModal = () => {
		onClose()
		onClearFiles()
	}

	// Need refactor

	const { uploadFileQuery } = useFileQuery("files-message")
	const { mutateAsync: filesUpload, isPending: fileUploadIsPending } =
		uploadFileQuery
	const { mutateAsync: sendMessage, isPending: sendMessageIsPending } =
		useSendMessage(chatId!, chatType, userId)

	const isLoading = fileUploadIsPending || sendMessageIsPending

	const client = useQueryClient()

	const addToCache = (message: MessageType, tempId: string) => {
		client.setQueryData<
			InfiniteData<{ messages: MessageType[]; nextCursor: string | null }>
		>(["messagesWS", chatId], old => {
			if (!old) {
				return {
					pages: [{ messages: [message], nextCursor: null }],
					pageParams: [undefined],
				}
			}
			// Avoid duplicates
			const exists = old.pages.some(p =>
				p.messages.some((m: MessageType) => m.id === tempId)
			)
			if (exists) return old
			const pages = [...old.pages]
			if (pages.length === 0) {
				return {
					pages: [{ messages: [message], nextCursor: null }],
					pageParams: [undefined],
				}
			}
			const lastIndex = pages.length - 1
			pages[lastIndex] = {
				...pages[lastIndex],
				messages: [...pages[lastIndex].messages, message],
			}
			return { ...old, pages }
		})
	}
	console.log({ files })

	const onMessageRecorderHandlers = async () => {
		if (!files.length) return

		const formData = new FormData()
		const currentComment = comment

		// Добавляем все файлы в один FormData
		files.forEach(file => {
			formData.append("files", file, file.name)
		})

		for (const uploadedFile of files) {
			const tempId = generateTemporaryId()

			const mediasType = getTypeOfMedia(uploadedFile.type)

			const optimisticMessage = {
				id: tempId,
				messageType: MessageEnum.FILE,
				status: MessageStatus.PENDING,
				userId,
				chatType,
				createdAt: new Date().toISOString(),
				media: [
					{
						name: uploadedFile.name,
						size: uploadedFile.size,
						type: mediasType,
					},
				],
			}

			addToCache(optimisticMessage as unknown as MessageType, tempId)
		}

		try {
			const uploadedFiles = await filesUpload(formData)

			// if (currentComment) {
			// 	await sendMessage({
			// 		content: currentComment,
			// 		messageType: MessageEnum.TEXT,
			// 	})
			// }

			for (const uploadedFile of uploadedFiles) {
				const mediasType = getTypeOfMedia(uploadedFile?.type ?? "file")

				await sendMessage({
					messageType: MessageEnum.FILE,
					mediaType: mediasType,
					content: currentComment ?? undefined,
					url: uploadedFile?.url,
					size: uploadedFile?.size,
					duration: uploadedFile?.duration,
					name: uploadedFile?.name,
				})
			}
		} catch (error) {
			console.error("Ошибка отправки файлов:", error)
		} finally {
			onCloseModal()
		}
	}

	return {
		files,
		comment,
		lengthIs10,
		fileInputRef,
		isLoading,
		onOpenInput,
		onChangeComment,
		onAddFiles,
		onDeleteFile,
		onCloseModal,
		onMessageRecorderHandlers,
	}
}
