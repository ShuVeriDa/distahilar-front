"use client"

import { ModalContacts } from "@/widgets/ModalContacts"
import { ModalSettings } from "@/widgets/ModalSettings"
import { ModalCreateChannelGroup } from "@/widgets/ModalСreateChannelGroup"
import { usePathname } from "next/navigation"
import { FC, useEffect, useState } from "react"
import { useModal } from "../hooks/useModal"

interface IModalProviderProps {}

export const ModalProvider: FC<IModalProviderProps> = () => {
	const [isMounted, setIsMounted] = useState(false)
	const { onClose } = useModal()
	const pathname = usePathname()

	useEffect(() => {
		setIsMounted(true)
	}, [])

	useEffect(() => {
		if (pathname === "/auth") onClose()
	}, [pathname])

	if (!isMounted) {
		return null
	}

	return (
		<>
			<ModalCreateChannelGroup />
			<ModalContacts />
			<ModalSettings />
		</>
	)
}
