"use client"

import { useModal } from "@/shared/hooks/useModal"
import { Field } from "@/shared/ui/Field"
import { ChangeEvent, FC, useRef, useState } from "react"
import { MdPhotoCamera } from "react-icons/md"

import { ChatRole } from "@/prisma/models"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"
import { useCommunityQuery } from "@/shared/lib/services/chat/community/useCommunityQuery"
import { useFileQuery } from "@/shared/lib/services/file/usefileQuery"
import { Button } from "@/shared/ui/ButtonShadCN/button"
import Image from "next/image"
import { SubmitHandler, useForm } from "react-hook-form"

interface IForm {
	name: string
	description: string
}

interface IModalCreateChannelGroupProps {}

export const ModalCreateChannelGroup: FC<
	IModalCreateChannelGroupProps
> = () => {
	const { onClose, modalData } = useModal()
	const { isOpen, type } = modalData
	const inputRef = useRef<HTMLInputElement>(null)

	const isModalOpen =
		isOpen && (type === EnumModel.CHANNEL || type === EnumModel.GROUP)

	const handleClickInput = () => {
		inputRef.current?.click()
	}

	const [file, setFile] = useState<File | null>(null)
	const [imageUrl, setImageUrl] = useState<string | null>(null)
	const { uploadFileQuery } = useFileQuery("avatar", setImageUrl)
	const { mutateAsync } = uploadFileQuery
	const { createCommunityQuery } = useCommunityQuery()
	const { mutateAsync: createCommunity } = createCommunityQuery

	const onChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
		setFile(e.currentTarget.files?.[0] || null)
	}

	const onSubmitFile = async () => {
		if (!file) return

		const formData = new FormData()
		formData.append("file", file)

		try {
			await mutateAsync(formData)
		} catch (error) {
			console.warn(error)
		}
	}

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

		try {
			await createCommunity({
				name: data.name,
				description: data.description,
				type: type === EnumModel.CHANNEL ? ChatRole.CHANNEL : ChatRole.DIALOG,
				imageUrl: imageUrl || undefined,
			})
		} catch (error) {
			console.warn(error)
		}

		reset()
	}

	const fieldName = type === EnumModel.CHANNEL ? "Channel name" : "Group name"

	return (
		<ModalLayout isModalOpen={isModalOpen} onClose={onClose}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-4">
						<div className="flex gap-3 w-full">
							<div>
								<button
									className="w-20 h-20 flex justify-center items-center rounded-full bg-[#40A7E3]"
									onClick={handleClickInput}
								>
									{file ? (
										<Image
											src={file ? URL.createObjectURL(file) : ""}
											className="object-cover rounded-full w-full h-full"
											width={80}
											height={80}
											alt="chat-avatar"
										/>
									) : (
										<MdPhotoCamera size={40} color="white" />
									)}
								</button>
								<input
									ref={inputRef}
									type="file"
									hidden
									onChange={onChangeImage}
								/>
							</div>

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
							className="bg-transition text-[#168ADE] dark:text-[#5DB2F2] hover:bg-blue-200"
							type="button"
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							className="bg-transition text-[#168ADE] dark:text-[#5DB2F2]  hover:bg-blue-200 dark:hover:bg-blue-900"
							type="submit"
						>
							Create
						</Button>
					</div>
				</div>
			</form>
		</ModalLayout>
	)
}
