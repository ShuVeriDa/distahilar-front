import { useMutation } from "@tanstack/react-query"
import { fileService } from "./file.service"

export const useFileQuery = (
	folderName?: string,
	setUrl?: (files: { url: string; size?: number }[]) => void
) => {
	const uploadFileQuery = useMutation({
		mutationFn: (data: FormData) => fileService.uploadFile(data, folderName),
		mutationKey: ["uploadFileQuery"],
		onSuccess: data => {
			if (setUrl && data) {
				setUrl(data)
			}
		},
	})

	return { uploadFileQuery }
}
