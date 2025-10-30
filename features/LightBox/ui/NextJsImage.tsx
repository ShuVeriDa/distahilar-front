import Image from "next/image"
import { FC } from "react"
import {
	isImageFitCover,
	isImageSlide,
	useLightboxProps,
	useLightboxState,
} from "yet-another-react-lightbox"

// Типы для слайда
export interface Slide {
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

	const hasSize = isNextJsImage(slide)
	const cover =
		isImageSlide(slide) && (hasSize ? isImageFitCover(slide, imageFit) : false)

	const width = hasSize
		? !cover
			? Math.round(
					(slide.width as number) *
						Math.min(
							rect.width / (slide.width as number),
							rect.height / (slide.height as number),
							1
						)
			  )
			: rect.width
		: rect.width

	const height = hasSize
		? !cover
			? Math.round(
					(slide.height as number) *
						Math.min(
							rect.width / (slide.width as number),
							rect.height / (slide.height as number),
							1
						)
			  )
			: rect.height
		: rect.height

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
