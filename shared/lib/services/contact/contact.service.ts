import { ContactType } from "@/prisma/models"
import { getContactUrl } from "../../axios/api.config"
import { instance } from "../../axios/axios"

export const contactService = {
	async searchContact(value: string) {
		const { data } = await instance.get<ContactType[]>(
			getContactUrl(`?name=${value}`)
		)

		return data
	},

	async getContact(contactId: string) {
		const { data } = await instance.get<ContactType>(
			getContactUrl(`/${contactId}`)
		)

		return data
	},

	async createContact(userId: string) {
		const { data } = await instance.post<ContactType>(getContactUrl(``), {
			userId,
		})

		return data
	},

	async deleteContact(contactId: string) {
		const { data } = await instance.delete<string>(
			getContactUrl(`/${contactId}`)
		)

		return data
	},
}
