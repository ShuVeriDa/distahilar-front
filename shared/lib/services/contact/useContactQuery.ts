import { useMutation, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useDispatch } from "react-redux"
import { changeUser } from "../../redux-store/slices/user-slice/userSlice"
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

	return useMemo(
		() => ({
			searchContactsQuery,
			fetchFolderQuery,
		}),
		[searchContactsQuery, fetchFolderQuery]
	)
}

export const useDeleteContactQuery = (interlocutorId: string) => {
	const dispatch = useDispatch()

	return useMutation({
		mutationFn: () => contactService.deleteContact(interlocutorId),
		mutationKey: ["deleteContactQuery"],
		onSuccess: data => {
			dispatch(
				changeUser({
					contactSaver: data,
				})
			)
		},
	})
}
export const useCreateContactQuery = () => {
	const dispatch = useDispatch()

	return useMutation({
		mutationFn: (userId: string) => contactService.createContact(userId),
		mutationKey: ["createContactQuery"],
		onSuccess: data => {
			dispatch(
				changeUser({
					contactSaver: data,
				})
			)
		},
	})
}
