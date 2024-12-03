"use client"

import { FC } from "react"

import { ModalFooter } from "@/entities/ModalFooter"
import { Field } from "@/shared"
import { useChangeAccountInfo } from "@/shared/hooks/useChangeAccountInfo"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { cn } from "@/shared/lib/utils/cn"
import { Typography } from "@/shared/ui/Typography/Typography"
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
							Username
						</Typography>
					</div>
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-2 px-4">
							<Field
								variant="primary"
								label="@username"
								minLength={2}
								maxLength={16}
								register={register("username", {
									required: "Username is required",
								})}
								watch={watch}
								disabled={isPending}
								errors={errors.username}
							/>
						</div>
						<Description
							text={cn(
								`You can choose a username on Telegram. If you do, other people will be able to find you by this username and contract you without knowing your phone number. You can user a-z, 0-9 and underscores. Minimum length is 5 characters.`
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
