import { useMutation, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { contactService } from "./contact.service"

export const useContactQuery = (
	contactId?: string,
	value?: string,
	isSearch?: boolean
) => {
	const searchContactsQuery = useQuery({
		queryFn: async () => contactService.searchContact(value ? value : ""),
		queryKey: ["searchContacts", value],
		enabled: !!isSearch,
	})

	const fetchFolderQuery = useQuery({
		queryFn: async () => contactService.getContact(contactId!),
		queryKey: ["contact", contactId],
		enabled: !!contactId,
	})

	const createContactQuery = useMutation({
		mutationFn: (userId: string) => contactService.createContact(userId),
	})

	const deleteContactQuery = useMutation({
		mutationFn: () => contactService.createContact(contactId!),
	})

	return useMemo(
		() => ({
			searchContactsQuery,
			fetchFolderQuery,
			createContactQuery,
			deleteContactQuery,
		}),
		[
			searchContactsQuery,
			fetchFolderQuery,
			createContactQuery,
			deleteContactQuery,
		]
	)
}
