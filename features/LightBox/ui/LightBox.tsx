import Image from "next/image"
import { FC, useRef, useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"

import NextJsImage from "@/features/LightBox/ui/NextJsImage"

import { Media } from "@prisma/client"

import { cn } from "@/shared/lib/utils/cn"
import "yet-another-react-lightbox/plugins/thumbnails.css"
import "yet-another-react-lightbox/styles.css"

interface IThumbnailsRef {
	visible: boolean
	show: () => void
	hide: () => void
}

export interface IImageSlide {
	src: string
}

interface ILightboxWrapperProps {
	allImages: IImageSlide[]
	media: Media
	isMessageContent: boolean
}

export const LightboxWrapper: FC<ILightboxWrapperProps> = ({
	allImages,
	media,
	isMessageContent,
}) => {
	const thumbnailsRef = useRef<IThumbnailsRef>(null)
	const [open, setOpen] = useState<boolean>(false)
	const [index, setIndex] = useState<number>(0)

	const onClose = (): void => setOpen(false)

	const onOpen = (): void => {
		// Находим индекс текущего изображения в массиве allImages
		const currentImageIndex: number = allImages.findIndex(
			(img: IImageSlide) => img.src === media.url
		)
		setIndex(currentImageIndex !== -1 ? currentImageIndex : 0)
		setOpen(true)
	}
	return (
		<>
			<Image
				src={media.url}
				alt={media.name ?? ""}
				width={0}
				height={0}
				sizes="100vw"
				className={cn(
					"w-auto h-auto max-w-full max-h-full object-contain rounded-2xl hover:cursor-pointer",
					isMessageContent && "rounded-b-none"
				)}
				onClick={onOpen}
			/>

			<Lightbox
				open={open}
				close={onClose}
				slides={allImages}
				index={index}
				render={{ slide: NextJsImage }}
				plugins={[Thumbnails]}
				thumbnails={{ ref: thumbnailsRef, border: 0 }}
				on={{
					click: (): void => {
						;(thumbnailsRef.current?.visible
							? thumbnailsRef.current?.hide
							: thumbnailsRef.current?.show)?.()
					},
				}}
			/>
		</>
	)
}
