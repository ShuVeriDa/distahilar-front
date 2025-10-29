"use client"

import { ChatMemberType, ChatType, ContactType } from "@/prisma/models"
import { changeUser } from "@/shared/lib/redux-store/slices/user-slice/userSlice"
import { useAppDispatch } from "@/shared/lib/redux-store/store"
import { useSocket } from "@/shared/providers/SocketProvider"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useUser } from "./useUser"

/**
 * Hook to subscribe to real-time user status updates via WebSocket
 * Updates Redux store and React Query cache when status changes are received
 */
export const useUserStatusUpdates = () => {
	const { socket } = useSocket()
	const dispatch = useAppDispatch()
	const { user } = useUser()
	const queryClient = useQueryClient()

	useEffect(() => {
		if (!socket || !user?.id) return
		const eventName = `user:${user.id}:statusUpdate`

		const handleStatusUpdate = (payload: {
			userId: string
			isOnline: boolean
			lastSeen: string | null
		}) => {
			const updatedUser = {
				isOnline: payload.isOnline,
				lastSeen: payload.lastSeen ? new Date(payload.lastSeen) : null,
			}

			// Update current user status if it's about the current user
			if (payload.userId === user.id) {
				dispatch(changeUser(updatedUser))
			}

			// Update contacts cache
			queryClient.setQueriesData<ContactType[]>(
				{ queryKey: ["searchContacts"], exact: false },
				oldData => {
					if (!oldData) return oldData
					return oldData.map(contact =>
						contact.savedContact.id === payload.userId
							? {
									...contact,
									savedContact: {
										...contact.savedContact,
										...updatedUser,
									},
							  }
							: contact
					)
				}
			)

			// Update specific contact cache
			queryClient.setQueriesData<ContactType>(
				{ queryKey: ["contact"], exact: false },
				oldData => {
					if (!oldData || oldData.savedContact.id !== payload.userId)
						return oldData
					return {
						...oldData,
						savedContact: {
							...oldData.savedContact,
							...updatedUser,
						},
					}
				}
			)

			// Update specific chat cache
			queryClient.setQueriesData<ChatType>(
				{ queryKey: ["fetchChatById"], exact: false },
				(oldData: ChatType | undefined) => {
					if (!oldData) return oldData
					return {
						...oldData,
						members: oldData.members?.map((member: ChatMemberType) =>
							member.userId === payload.userId
								? {
										...member,
										user: {
											...member.user,
											...updatedUser,
										},
								  }
								: member
						),
					}
				}
			)
		}

		socket.on(eventName, handleStatusUpdate)

		return () => {
			socket.off(eventName, handleStatusUpdate)
		}
	}, [socket, user?.id, dispatch, queryClient])
}
