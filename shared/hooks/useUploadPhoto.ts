"use client"

import { ChangeEvent, useRef, useState } from "react"
import { useFileQuery } from "../lib/services/file/usefileQuery"
import { useUserQuery } from "../lib/services/user/useUserQuery"

export const useUploadPhoto = (url?: string, isFetching?: boolean) => {
	const [file, setFile] = useState<File | null>(null)
	const [imageUrl, setImageUrl] = useState<string | null>(url ?? null)
	const inputRef = useRef<HTMLInputElement>(null)

	const onSetImage = (files: { url: string; size?: number }[]) => {
		const url = files[0].url
		setImageUrl(url)
	}

	const { uploadFileQuery } = useFileQuery("avatar", onSetImage)
	const { mutateAsync } = uploadFileQuery

	const { userEdit } = useUserQuery()
	const { mutateAsync: userEditMutate } = userEdit

	const handleClickInput = () => {
		inputRef.current?.click()
	}

	const onSubmitFile = async (fileValue: File | null) => {
		if (!fileValue) return

		const formData = new FormData()
		formData.append("files", fileValue)

		const data = await mutateAsync(formData)
		return data[0]
	}

	const onChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
		const fileValue = e.currentTarget.files?.[0] || null
		console.log({ files: e.currentTarget.files, fileValue })
		setFile(fileValue)
		const dataUrl = await onSubmitFile(fileValue)
		console.log({ dataUrl })

		if (dataUrl) {
			setImageUrl(dataUrl.url)
		}

		if (isFetching) {
			await userEditMutate({ imageUrl: dataUrl?.url })
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
