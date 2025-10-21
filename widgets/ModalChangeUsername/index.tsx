"use client"

import { FC } from "react"

import { ModalFooter } from "@/entities/ModalFooter"
import { Field } from "@/shared"
import { useChangeAccountInfo } from "@/shared/hooks/useChangeAccountInfo"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { cn } from "@/shared/lib/utils/cn"
import { Typography } from "@/shared/ui/Typography/Typography"
import { useTranslations } from "next-intl"
import { Description } from "../ModalAccountInfo/shared/ui/Description"

interface IModalChangeUserNameProps {}

export const ModalChangeUserName: FC<IModalChangeUserNameProps> = () => {
	const {
		errors,
		isPending,
		watch,
		onSubmit,
		register,
		handleSubmit,
		onCloseCurrentModal,
	} = useChangeAccountInfo()
	const t = useTranslations("MODALS.EDIT_USERNAME")
	const tValidation = useTranslations("VALIDATION")

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
							{t("TITLE")}
						</Typography>
					</div>
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-2 px-4">
							<Field
								variant="primary"
								label={t("USERNAME")}
								minLength={2}
								maxLength={16}
								register={register("username", {
									required: tValidation("USERNAME_REQUIRED"),
								})}
								watch={watch}
								disabled={isPending}
								errors={errors.username}
							/>
						</div>
						<Description
							text={cn(
								`${t("USERNAME_INFO.TITLE")} ${t("USERNAME_INFO.EXAMPLE")}`
							)}
							splitWord="You can user"
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
