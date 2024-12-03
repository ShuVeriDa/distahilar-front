import { useModal } from "@/shared/hooks/useModal"
import { useUserQuery } from "@/shared/lib/services/user/useUserQuery"
import { ChangeEvent } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { formatPhoneNumber } from "../lib/utils/formatPhoneNumber"

export interface IChangeAccountInfoInput {
	name?: string
	surname?: string
	phone?: string
	username?: string
}

export const useChangeAccountInfo = () => {
	const { onClose, onCloseCurrentModal, currentModal } = useModal()
	const { data } = currentModal
	const name = data?.changeInfo?.firstName
	const surname = data?.changeInfo?.surname
	const phone = data?.changeInfo?.phone
	const username = data?.changeInfo?.username

	const { userEdit } = useUserQuery()
	const { mutateAsync: userEditMutate, isPending } = userEdit
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
		control,
		setValue,
	} = useForm<IChangeAccountInfoInput>({
		values: {
			name: name || undefined,
			surname: surname || undefined,
			phone: phone || undefined,
			username: username || undefined,
		},
	})

	const phoneValue = watch("phone", "")

	const onChangePhone = (e: ChangeEvent<HTMLInputElement>) => {
		const formattedValue = formatPhoneNumber(e.currentTarget.value)
		setValue("phone", formattedValue, { shouldValidate: true })
	}

	const onSubmit: SubmitHandler<IChangeAccountInfoInput> = async data => {
		if (
			data.name?.trim() !== name ||
			data.surname?.trim() !== surname ||
			data.phone?.trim() !== phone ||
			data.username?.trim() !== username
		) {
			await userEditMutate({
				name: data.name?.trim(),
				surname: data.surname?.trim(),
				phone: data.phone?.trim(),
				username: data.username?.trim(),
			})
		}
		reset()
		onCloseCurrentModal()
	}

	return {
		phoneValue,
		control,
		currentModal,
		isPending,
		errors,

		register,
		onSubmit,
		onClose,
		onChangePhone,
		watch,
		handleSubmit,
		onCloseCurrentModal,
		setValue,
	}
}
