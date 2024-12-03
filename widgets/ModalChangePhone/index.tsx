"use client"

import { FC } from "react"

import { ModalFooter } from "@/entities/ModalFooter"
import { Field } from "@/shared"
import { useChangeAccountInfo } from "@/shared/hooks/useChangeAccountInfo"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { cn } from "@/shared/lib/utils/cn"
import { Typography } from "@/shared/ui/Typography/Typography"

interface IModalChangePhoneProps {}

export const ModalChangePhone: FC<IModalChangePhoneProps> = () => {
	const {
		errors,
		isPending,
		phoneValue,

		onClose,
		onSubmit,
		register,
		handleSubmit,
		onCloseCurrentModal,
		onChangePhone,
	} = useChangeAccountInfo()

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
							Edit your phone number
						</Typography>
					</div>
					<div className="flex flex-col gap-2 px-4">
						<Field
							variant="primary"
							label="Phone number"
							value={phoneValue}
							{...register("phone", {
								required: "Phone number is required",
								validate: value =>
									/^\+?\d+\s?\(?\d{1,3}\)?\s?\d{1,3}-\d{1,2}-\d{1,2}$/.test(
										value ? value : ""
									) || "Invalid phone number format",
								onChange: onChangePhone,
							})}
							type="tel"
							disabled={isPending}
							errors={errors.phone}
						/>

						{errors && errors.phone && <p>{errors.phone.message}</p>}
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
