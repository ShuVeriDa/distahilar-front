import { $Enums } from "@prisma/client"
import { useState } from "react"
import { EnumModel } from "../lib/redux-store/slices/model-slice/type"
import { useModal } from "./useModal"

export const useFileManager = (
	chatId: string,
	chatType: $Enums.ChatRole | undefined,
	userId: string | undefined
) => {
	const { onOpenModal } = useModal()
	const [files, setFiles] = useState<File[]>([])

	const onAddFiles = (fileList: FileList) => {
		const newFiles = Array.from(fileList)
		const availableSlots = 10 - files.length
		const filesToAdd = newFiles.slice(0, availableSlots)

		if (filesToAdd.length > 0) {
			setFiles(prev => [...prev, ...filesToAdd])

			onOpenModal(EnumModel.ADD_FILES, {
				addFiles: {
					files: [...files, ...filesToAdd],
					chatId,
					chatType,
					userId,
					onAddFiles,
					onClearFiles,
					onDeleteFile,
				},
			})
		}
	}

	const onClearFiles = () => setFiles([])
	const onDeleteFile = (index: number) => {
		setFiles(prev => prev.filter((_, i) => i !== index))
	}

	return {
		onAddFiles,
	}
}
