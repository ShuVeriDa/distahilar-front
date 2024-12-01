"use client"

import { useModal } from "@/shared/hooks/useModal"
import { FC } from "react"

import { ModalFooter } from "@/entities/ModalFooter"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { useUserQuery } from "@/shared/lib/services/user/useUserQuery"
import { cn } from "@/shared/lib/utils/cn"
import { Field } from "@/shared/ui/Field"
import { Typography } from "@/shared/ui/Typography/Typography"
import { SubmitHandler, useForm } from "react-hook-form"

interface IModalCHangeNameProps {}

interface IFormInput {
	name: string
	surname: string
}

export const ModalCHangeName: FC<IModalCHangeNameProps> = () => {
	const { onClose, onCloseCurrentModal, currentModal } = useModal()
	const { data } = currentModal
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
		defaultValues: {
			name: name || "",
			surname: surname || "",
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

	return (
		<ModalLayout
			onClose={onClose}
			className="p-0 w-[300px] flex flex-col !gap-5"
			isClickOutside={false}
			translateX={0}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col">
					<div className={cn("flex flex-col gap-4 px-4 py-4")}>
						<Typography tag="h4" className="font-normal">
							Edit your name
						</Typography>
					</div>
					<div className="flex flex-col gap-2 px-4">
						<Field
							variant="primary"
							label="First name"
							register={register("name", {
								required: "Name is required",
								minLength: {
									value: 2,
									message: "Name must be at least 2 characters long",
								},
								maxLength: {
									value: 32,
									message: "Name must be no more than 32 characters long",
								},
							})}
							minLength={2}
							maxLength={32}
							disabled={isPending}
							errors={errors.name}
							watch={watch}
						/>
						<Field
							variant="primary"
							label="Last name"
							register={register("surname", {
								required: "Last name is required",
								minLength: {
									value: 2,
									message: "Last name must be at least 2 characters long",
								},
								maxLength: {
									value: 32,
									message: "Last name must be no more than 32 characters long",
								},
							})}
							minLength={2}
							maxLength={32}
							disabled={isPending}
							errors={errors.surname}
							watch={watch}
						/>
					</div>
				</div>
				<ModalFooter
					onClose={onCloseCurrentModal}
					isLoading={isPending}
					className="after:hidden"
					type="submit"
				/>
			</form>
		</ModalLayout>
	)
}
