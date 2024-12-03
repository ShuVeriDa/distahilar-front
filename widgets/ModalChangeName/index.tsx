"use client"

import { FC } from "react"

import { ModalFooter } from "@/entities/ModalFooter"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { cn } from "@/shared/lib/utils/cn"
import { Typography } from "@/shared/ui/Typography/Typography"
import { useChangeAccountInfo } from "../../shared/hooks/useChangeAccountInfo"
import { ChangeName } from "./features/ChangeName"

interface IModalChangeNameProps {}

export const ModalChangeName: FC<IModalChangeNameProps> = () => {
	const {
		onSubmit,
		register,
		errors,
		watch,
		isPending,
		handleSubmit,
		onCloseCurrentModal,
	} = useChangeAccountInfo()

	return (
		<ModalLayout
			onClose={() => {}}
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
					<ChangeName
						register={register}
						errors={errors}
						watch={watch}
						isPending={isPending}
					/>
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
