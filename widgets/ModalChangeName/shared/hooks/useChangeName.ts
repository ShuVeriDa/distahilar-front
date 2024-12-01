import { useModal } from "@/shared/hooks/useModal"
import { useUser } from "@/shared/hooks/useUser"
import { useUserQuery } from "@/shared/lib/services/user/useUserQuery"
import { SubmitHandler, useForm } from "react-hook-form"

interface IFormInput {
	name: string
	surname: string
}

export const useChangeName = () => {
	const { onClose, onCloseCurrentModal, currentModal } = useModal()
	const { data } = currentModal
	const { user } = useUser()
	const name = data?.changeInfo?.firstName
	const surname = data?.changeInfo?.surname

	const { userEdit } = useUserQuery()
	const { mutateAsync: userEditMutate, isPending } = userEdit
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
	} = useForm<IFormInput>({
		values: {
			name: user?.name || "",
			surname: user?.surname || "",
		},
	})

	const onSubmit: SubmitHandler<IFormInput> = async data => {
		if (data.name.trim() !== name || data.surname.trim() !== surname) {
			await userEditMutate({
				name: data.name.trim(),
				surname: data.surname.trim(),
			})
		}
		reset()
		onCloseCurrentModal()
	}

	return {
		currentModal,
		onClose,
		register,
		onSubmit,
		isPending,
		errors,
		watch,
		handleSubmit,
		onCloseCurrentModal,
	}
}
