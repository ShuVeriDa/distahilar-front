import { instance } from "../../axios/axios"

export const fileService = {
	async uploadFile(formDate: FormData, folderName?: string) {
		const { data } = await instance.post<
			{
				url: string
				size: number
				duration?: number
			}[]
		>(`/files`, formDate, {
			params: { folder: `${folderName}` },
			headers: {
				"Content-Type": "multipart/form-data",
			},
			onUploadProgress: progressEvent => {
				const percentCompleted = Math.round(
					(progressEvent.loaded * 100) / (progressEvent.total || 1)
				)
				console.log({ percentCompleted })
			},
		})

		return data
	},
}
