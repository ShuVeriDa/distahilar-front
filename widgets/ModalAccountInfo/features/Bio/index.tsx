import { useUser } from "@/shared/hooks/useUser"
import { useUserQuery } from "@/shared/lib/services/user/useUserQuery"
import { Textarea } from "@/shared/ui/Textarea"
import { ChangeEvent, FC, useEffect, useRef, useState } from "react"

interface IBioProps {}

export const Bio: FC<IBioProps> = () => {
	const { user } = useUser()
	const [value, setValue] = useState(user?.bio ?? "")
	const textAreaRef = useRef<HTMLTextAreaElement>(null)
	const { userEdit } = useUserQuery()
	const { mutateAsync: userEditMutate } = userEdit

	const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setValue(e.currentTarget.value)
	}

	useEffect(() => {
		if (textAreaRef.current) {
			textAreaRef.current.style.height = "auto"
			textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
		}
	}, [value])

	const onBlur = async () => {
		if (user?.bio !== value) {
			await userEditMutate({ bio: value })
		}
	}

	return (
		<Textarea
			variant="accountInfo"
			maxLength={70}
			placeholder="Bio"
			ref={textAreaRef}
			onChange={onChange}
			onBlur={onBlur}
			value={value}
			rows={1}
		/>
	)
}
