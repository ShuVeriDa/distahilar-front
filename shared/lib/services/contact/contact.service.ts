import { ContactType } from "@/prisma/models"
import { getFolderUrl } from "../../axios/api.config"
import { instance } from "../../axios/axios"

export const contactService = {
	async searchContact(value?: string) {
		const { data } = await instance.get<ContactType[]>(
			getFolderUrl(`?name=${value}`)
		)

		return data
	},

	async getContact(contactId: string) {
		const { data } = await instance.get<ContactType>(
			getFolderUrl(`/${contactId}`)
		)

		return data
	},

	async createContact(userId: string) {
		const { data } = await instance.post<ContactType>(getFolderUrl(``), {
			userId,
		})

		return data
	},

	async deleteContact(contactId: string) {
		const { data } = await instance.delete<string>(
			getFolderUrl(`/${contactId}`)
		)

		return data
	},
}
