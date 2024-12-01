import { ChangeEvent, useRef, useState } from "react"
import { useFileQuery } from "../lib/services/file/usefileQuery"

export const useChangePhoto = (url?: string) => {
	const [file, setFile] = useState<File | null>(null)
	const [imageUrl, setImageUrl] = useState<string | null>(url ?? null)
	const inputRef = useRef<HTMLInputElement>(null)

	const { uploadFileQuery } = useFileQuery("avatar", setImageUrl)
	const { mutateAsync } = uploadFileQuery

	const handleClickInput = () => {
		inputRef.current?.click()
	}

	const onChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
		setFile(e.currentTarget.files?.[0] || null)
	}

	const onSubmitFile = async () => {
		if (!file) return

		const formData = new FormData()
		formData.append("file", file)

		try {
			await mutateAsync(formData)
		} catch (error) {
			console.warn(error)
		}
	}

	return {
		inputRef,
		handleClickInput,
		onChangeImage,
		onSubmitFile,
		file,
		imageUrl,
	}
}
