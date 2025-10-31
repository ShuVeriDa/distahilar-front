import {
	ChangePhotoNS,
	ENUM_VARIANT_PHOTO,
	useClassName,
} from "@/features/ChangePhoto/shared/hooks/useClassName"
import { cn } from "@/shared/lib/utils/cn"
import { Button } from "@/shared/ui/Button"
import Image from "next/image"
import { ChangeEvent, FC, RefObject } from "react"
import { MdPhotoCamera } from "react-icons/md"

interface IDefaultVariantProps {
	variant: keyof typeof ChangePhotoNS.variants
	file: File | null
	inputRef: RefObject<HTMLInputElement>
	onChangeImage: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
	onClick: () => void
	imageUrl: string | null
}

export const DefaultVariant: FC<IDefaultVariantProps> = ({
	variant,
	file,
	inputRef,
	onChangeImage,
	onClick,
	imageUrl,
}) => {
	const {
		WRAPPER,
		DEFAULT_IMAGE_ALT,
		DEFAULT_VARIANT_BUTTON,
		DEFAULT_VARIANT_IMAGE,
		IMAGE_ALT,
		IMAGE_HEIGHT,
		IMAGE_WIDTH,
		VARIANT_BUTTON,
		VARIANT_IMAGE,
	} = useClassName(variant)
	return (
		<div
			className={cn(
				variant === ENUM_VARIANT_PHOTO.DEFAULT ? WRAPPER : "hidden"
			)}
		>
			<Button
				className={cn(DEFAULT_VARIANT_BUTTON, VARIANT_BUTTON)}
				onClick={onClick}
			>
				{file || imageUrl ? (
					<Image
						src={file ? URL.createObjectURL(file) : imageUrl!}
						className={cn(DEFAULT_VARIANT_IMAGE, VARIANT_IMAGE, "object-cover")}
						width={IMAGE_WIDTH}
						height={IMAGE_HEIGHT}
						alt={IMAGE_ALT}
						loading="lazy"
					/>
				) : (
					<MdPhotoCamera size={DEFAULT_IMAGE_ALT} color="white" />
				)}
			</Button>
			<input ref={inputRef} type="file" hidden onChange={onChangeImage} />
		</div>
	)
}
