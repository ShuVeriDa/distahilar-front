import { useMutation } from "@tanstack/react-query"
import { useMemo } from "react"
import { fileService } from "./file.service"

export const useFileQuery = (
	folderName?: string,
	setUrl?: (url: string) => void
) => {
	const uploadFileQuery = useMutation({
		mutationFn: (data: FormData) => fileService.uploadFile(data, folderName),
		mutationKey: ["deleteContactQuery"],
		onSuccess: data => {
			if (setUrl) {
				setUrl(data[0].url)
			}
		},
	})

	return useMemo(
		() => ({
			uploadFileQuery,
		}),
		[uploadFileQuery]
	)
}
