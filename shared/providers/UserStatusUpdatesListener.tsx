"use client"

import { FC } from "react"
import { useUserStatusUpdates } from "../hooks/useUserStatusUpdates"

export const UserStatusUpdatesListener: FC = () => {
	useUserStatusUpdates()
	return null
}
