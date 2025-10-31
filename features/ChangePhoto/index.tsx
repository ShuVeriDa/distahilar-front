import { AccountInfoVariant, DefaultVariant } from "@/entities/PhotoVariant"
import { ChangeEvent, FC, RefObject } from "react"
import { ChangePhotoNS } from "./shared/hooks/useClassName"

interface IChangePhotoProps {
	file: File | null
	inputRef: RefObject<HTMLInputElement>
	onChangeImage: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
	onClick: () => void
	variant: keyof typeof ChangePhotoNS.variants
	imageUrl?: string | null
}

export const ChangePhoto: FC<IChangePhotoProps> = ({
	file,
	inputRef,
	onChangeImage,
	onClick,
	variant,
	imageUrl,
}) => {
	return (
		<div>
			<DefaultVariant
				file={file}
				inputRef={inputRef}
				onChangeImage={onChangeImage}
				onClick={onClick}
				variant={variant}
				imageUrl={imageUrl!}
			/>

			<AccountInfoVariant
				file={file}
				inputRef={inputRef}
				onChangeImage={onChangeImage}
				onClick={onClick}
				variant={variant}
				imageUrl={imageUrl!}
			/>
		</div>
	)
}
