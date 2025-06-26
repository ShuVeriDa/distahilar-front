import Image from "next/image"
import { FC } from "react"
import {
	isImageFitCover,
	isImageSlide,
	useLightboxProps,
	useLightboxState,
} from "yet-another-react-lightbox"

// Типы для слайда
interface Slide {
	src: string
	alt?: string
	width?: number
	height?: number
	blurDataURL?: string
}

// Типы для rect (размеры контейнера)
interface ContainerRect {
	width: number
	height: number
}

// Типы для пропсов компонента
interface NextJsImageProps {
	slide: Slide
	offset: number
	rect: ContainerRect
}

function isNextJsImage(
	slide: Slide
): slide is Slide & { width: number; height: number } {
	return (
		isImageSlide(slide) &&
		typeof slide.width === "number" &&
		typeof slide.height === "number"
	)
}

const NextJsImage: FC<NextJsImageProps> = ({ slide, offset, rect }) => {
	const {
		on: { click },
		carousel: { imageFit },
	} = useLightboxProps()

	const { currentIndex } = useLightboxState()

	const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit)

	if (!isNextJsImage(slide)) return undefined

	const width = !cover
		? Math.round(
				Math.min(rect.width, (rect.height / slide.height) * slide.width) / 2
		  )
		: rect.width / 2

	const height = !cover
		? Math.round(
				Math.min(rect.height, (rect.width / slide.width) * slide.height) / 2
		  )
		: rect.height / 2

	return (
		<div style={{ position: "relative", width, height }}>
			<Image
				fill
				alt={slide.alt || ""}
				src={slide.src}
				loading="eager"
				draggable={false}
				placeholder={slide.blurDataURL ? "blur" : undefined}
				style={{
					objectFit: cover ? "cover" : "contain",
					cursor: click ? "pointer" : undefined,
				}}
				sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
				onClick={
					offset === 0 ? () => click?.({ index: currentIndex }) : undefined
				}
			/>
		</div>
	)
}

export default NextJsImage
