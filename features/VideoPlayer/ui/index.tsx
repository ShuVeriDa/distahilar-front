import { IThumbnailsRef } from "@/features/LightBox/ui/LightBox"
import { cn } from "@/shared/lib/utils/cn"
import { Media } from "@prisma/client"
import { FC, useCallback, useRef, useState } from "react"
import { GoPlay } from "react-icons/go"
import Lightbox from "yet-another-react-lightbox"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import Video from "yet-another-react-lightbox/plugins/video"
import "yet-another-react-lightbox/styles.css"

interface IVideoPlayerProps {
	allVideos: IVideoLightBox[]
	isMessageContent: boolean
	media: Media
}

export interface IVideoLightBox {
	src: string
	type: string
}

interface IVideoSlide {
	type: "video"
	sources: Array<{
		src: string
		type: string
	}>
	poster?: string
}

export const VideoPlayer: FC<IVideoPlayerProps> = ({
	allVideos,
	media,
	isMessageContent,
}) => {
	const thumbnailsRef = useRef<IThumbnailsRef>(null)
	const [lightboxOpen, setLightboxOpen] = useState(false)
	const [index, setIndex] = useState<number>(0)

	const handleThumbnailClick = useCallback(() => {
		const currentImageIndex: number = allVideos.findIndex(
			obj => obj.src === media.url
		)
		setIndex(currentImageIndex !== -1 ? currentImageIndex : 0)
		setLightboxOpen(true)
	}, [allVideos, media.url])

	const closeLightbox = () => setLightboxOpen(false)

	// Create video slide for lightbox
	const videoSlides: IVideoSlide[] = allVideos.map(obj => {
		return {
			type: "video",
			poster: undefined,
			sources: [
				{
					src: obj.src,
					type: `video/${obj.type}`,
				},
			],
		}
	})

	return (
		<div className="relative">
			{/* Hidden video for thumbnail generation */}
			<video
				src={media.url}
				className={cn(
					"w-auto h-auto max-w-full max-h-full object-contain rounded-2xl rounded-tr-md hover:cursor-pointer",
					isMessageContent && "rounded-b-none"
				)}
				onClick={handleThumbnailClick}
				preload="auto"
				muted
				crossOrigin="anonymous"
			/>

			{!lightboxOpen && (
				<div
					className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:cursor-pointer"
					onClick={handleThumbnailClick}
				>
					<GoPlay size={100} color="white" />
				</div>
			)}

			<Lightbox
				open={lightboxOpen}
				close={closeLightbox}
				slides={videoSlides}
				index={index}
				plugins={[Video, Thumbnails]}
				thumbnails={{ ref: thumbnailsRef, border: 0 }}
				video={{
					controls: true,
					playsInline: true,
					autoPlay: true,
				}}
				on={{
					click: (): void => {
						;(thumbnailsRef.current?.visible
							? thumbnailsRef.current?.hide
							: thumbnailsRef.current?.show)?.()
					},
				}}
			/>
		</div>
	)
}
