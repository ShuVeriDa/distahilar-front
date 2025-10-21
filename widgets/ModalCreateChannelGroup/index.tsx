"use client"

import { useModal } from "@/shared/hooks/useModal"
import { Field } from "@/shared/ui/Field"
import { FC } from "react"

import { ChangePhoto } from "@/features/ChangePhoto"
import { ENUM_VARIANT_PHOTO } from "@/features/ChangePhoto/shared/hooks/useClassName"
import { ChatRole } from "@/prisma/models"

import { useChangePhoto } from "@/shared"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { useCommunityQuery } from "@/shared/lib/services/chat/community/useCommunityQuery"
import { Button } from "@/shared/ui/Button"
import { useTranslations } from "next-intl"
import { SubmitHandler, useForm } from "react-hook-form"

interface IForm {
	name: string
	description: string
}

interface IModalCreateChannelGroupProps {}

export const ModalCreateChannelGroup: FC<
	IModalCreateChannelGroupProps
> = () => {
	const t = useTranslations("MODALS.CREATE_CHANNEL_GROUP")
	const tCommon = useTranslations("COMMON")
	const { onClose, currentModal } = useModal()
	const { type } = currentModal

	const { file, inputRef, handleClickInput, onChangeImage, imageUrl } =
		useChangePhoto()

	const { createCommunityQuery } = useCommunityQuery()
	const { mutateAsync: createCommunity } = createCommunityQuery

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<IForm>()

	const onSubmit: SubmitHandler<IForm> = async data => {
		await createCommunity({
			name: data.name,
			description: data.description,
			type: type === EnumModel.CHANNEL ? ChatRole.CHANNEL : ChatRole.GROUP,
			imageUrl: imageUrl || undefined,
		})

		reset()
		onClose()
	}

	const fieldName =
		type === EnumModel.CHANNEL ? t("CHANNEL_NAME") : t("GROUP_NAME")

	return (
		<ModalLayout onClose={onClose} isClickOutside>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-4">
						<div className="flex gap-3 w-full">
							<ChangePhoto
								onClick={handleClickInput}
								file={file}
								inputRef={inputRef}
								onChangeImage={onChangeImage}
								variant={ENUM_VARIANT_PHOTO.DEFAULT}
							/>

							<Field
								type="text"
								placeholder={
									type === EnumModel.CHANNEL
										? t("CHANNEL_PLACEHOLDER")
										: t("GROUP_PLACEHOLDER")
								}
								register={register("name", {
									required: t("NAME_REQUIRED"),
								})}
								minLength={2}
								maxLength={32}
								errors={errors.name}
								label={fieldName}
								classNameLabel="text-[13px]  dark:text-[#6F8398] text-blue-500 font-medium"
							/>
						</div>
						<Field
							isType="textarea"
							register={register("description")}
							errors={errors.description}
							maxLength={70}
							placeholder={
								type === EnumModel.CHANNEL
									? t("CHANNEL_DESCRIPTION_PLACEHOLDER")
									: t("GROUP_DESCRIPTION_PLACEHOLDER")
							}
							label={t("DESCRIPTION_OPTIONAL")}
							classNameLabel="text-[13px]  dark:text-[#6F8398] text-blue-500 font-medium"
						/>
					</div>

					<div className="flex justify-end gap-2">
						<Button
							variant="withoutBg"
							size="md"
							type="button"
							onClick={onClose}
						>
							{tCommon("CANCEL")}
						</Button>
						<Button variant="withoutBg" size="md" type="submit">
							{tCommon("CREATE")}
						</Button>
					</div>
				</div>
			</form>
		</ModalLayout>
	)
}
