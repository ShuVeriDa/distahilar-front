"use client"

import data from "@emoji-mart/data"
import { useLocale } from "next-intl"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"
import { FC, ReactNode } from "react"
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../HoverCard/hover-card"
const Picker = dynamic(() => import("@emoji-mart/react"), {
	ssr: false,
})

type EmojiType = {
	id: string
	name: string
	native: string
	unified: string
	keywords: string[]
	shortcodes: string
}

interface IIconPickerProps {
	onChange: (icon: string) => void
	children?: ReactNode
	asChild?: boolean
}

export const IconPicker: FC<IIconPickerProps> = ({
	asChild,
	children,
	onChange,
}) => {
	const { resolvedTheme } = useTheme()
	const locale = useLocale()

	return (
		<HoverCard>
			<HoverCardTrigger asChild={asChild}>{children}</HoverCardTrigger>
			<HoverCardContent className={"p-0 w-full border-none "}>
				<Picker
					data={data}
					onEmojiSelect={(obj: EmojiType) => {
						onChange(obj.native)
					}}
					theme={resolvedTheme}
					locale={locale}
					previewPosition={"none"}
					autoFocus
					// set={EmojiSet }
				/>
			</HoverCardContent>
		</HoverCard>
	)
}
