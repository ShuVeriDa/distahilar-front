import { ChangePhoto } from "@/features/ChangePhoto"
import { useChangePhoto } from "@/shared/hooks/useChangePhoto"
import { FC } from "react"

interface IAvatarProps {
	avatar: string
}

export const Avatar: FC<IAvatarProps> = ({ avatar }) => {
	const {
		file,
		handleClickInput,
		imageUrl,
		inputRef,
		onChangeImage,
		// onSubmitFile,
	} = useChangePhoto(avatar)

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
