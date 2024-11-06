import { instance } from "../../axios/axios"

export const fileService = {
	async uploadFile(formDate: FormData, folderName?: string) {
		const { data } = await instance.post<{ url: string }>(`/files`, formDate, {
			params: { folder: `${folderName}` },
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})

		return data
	},
}
