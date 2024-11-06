"use client"

import { ModalCreateChannelGroup } from "@/widgets/ModalСreateChannelGroup"
import { FC, useEffect, useState } from "react"

interface IModalProviderProps {}

export const ModalProvider: FC<IModalProviderProps> = () => {
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) {
		return null
	}

	return (
		<>
			<ModalCreateChannelGroup />
		</>
	)
}
