"use client"

import { useModal } from "@/shared/hooks/useModal"
import { Field } from "@/shared/ui/Field"
import { FC } from "react"

import { ChangePhoto } from "@/features/ChangePhoto"
import { ENUM_VARIANT_PHOTO } from "@/features/ChangePhoto/shared/hooks/useClassName"
import { ChatRole } from "@/prisma/models"
import { useChangePhoto } from "@/shared/hooks/useChangePhoto"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { useCommunityQuery } from "@/shared/lib/services/chat/community/useCommunityQuery"
import { Button } from "@/shared/ui/Button"
import { SubmitHandler, useForm } from "react-hook-form"

interface IForm {
	name: string
	description: string
}

interface IModalCreateChannelGroupProps {}

export const ModalCreateChannelGroup: FC<
	IModalCreateChannelGroupProps
> = () => {
	const { onClose, currentModal } = useModal()
	const { type } = currentModal

	const {
		file,
		inputRef,
		imageUrl,
		handleClickInput,
		onChangeImage,
		onSubmitFile,
	} = useChangePhoto()

	const { createCommunityQuery } = useCommunityQuery()
	const { mutateAsync: createCommunity } = createCommunityQuery

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<IForm>()

	const onSubmit: SubmitHandler<IForm> = async data => {
		if (file) {
			await onSubmitFile()
		}

		await createCommunity({
			name: data.name,
			description: data.description,
			type: type === EnumModel.CHANNEL ? ChatRole.CHANNEL : ChatRole.DIALOG,
			imageUrl: imageUrl || undefined,
		})

		reset()
	}

	const fieldName = type === EnumModel.CHANNEL ? "Channel name" : "Group name"

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
								placeholder={`Write the name of the ${
									type === EnumModel.CHANNEL ? "channel" : "group"
								}`}
								register={register("name", {
									required: "Name is required",
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
							placeholder={`Write the description of the ${
								type === EnumModel.CHANNEL ? "channel" : "group"
							}`}
							label="Description (optional)"
							classNameLabel="text-[13px] text-blue-500  dark:text-[#6F8398]  font-medium"
						/>
					</div>

					<div className="flex justify-end gap-2">
						<Button
							variant="withoutBg"
							size="md"
							type="button"
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button variant="withoutBg" size="md" type="submit">
							Create
						</Button>
					</div>
				</div>
			</form>
		</ModalLayout>
	)
}
