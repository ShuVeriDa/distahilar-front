import { useUser } from "@/shared/hooks/useUser"
import { useUserQuery } from "@/shared/lib/services/user/useUserQuery"
import { Textarea } from "@/shared/ui/Textarea"
import { useTranslations } from "next-intl"
import { ChangeEvent, FC, useEffect, useRef, useState } from "react"

interface IBioProps {}

export const Bio: FC<IBioProps> = () => {
	const { user } = useUser()
	const t = useTranslations("MODALS.ACCOUNT_INFO")
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
			placeholder={t("BIO_PLACEHOLDER")}
			ref={textAreaRef}
			onChange={onChange}
			onBlur={onBlur}
			value={value}
			rows={1}
		/>
	)
}
