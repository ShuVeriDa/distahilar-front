import { useState } from "react"

export const useFileManager = () => {
	const [files, setFiles] = useState<File[]>([])

	const onAddFiles = (fileList: FileList) => {
		const newFiles = Array.from(fileList)
		setFiles(prev => [...prev, ...newFiles])
	}

	const onClearFiles = () => setFiles([])
	const onDeleteFile = (index: number) => {
		setFiles(prev => prev.filter((_, i) => i !== index))
	}

	return {
		files,
		onAddFiles,
		onClearFiles,
		onDeleteFile,
	}
}
