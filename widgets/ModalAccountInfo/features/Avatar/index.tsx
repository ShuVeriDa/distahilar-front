import { ChangePhoto } from "@/features/ChangePhoto"
import { useUploadPhoto } from "@/shared/hooks/useUploadPhoto"
import { FC } from "react"

interface IAvatarProps {
	avatar: string
}

export const Avatar: FC<IAvatarProps> = ({ avatar }) => {
	const { file, handleClickInput, imageUrl, inputRef, onChangeImage } =
		useUploadPhoto(avatar, true)

	return (
		<ChangePhoto
			file={file}
			inputRef={inputRef}
			onChangeImage={onChangeImage}
			onClick={handleClickInput}
			variant="accountInfo"
			imageUrl={imageUrl}
		/>
	)
}
