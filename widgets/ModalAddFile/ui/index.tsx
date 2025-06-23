"use client"

import { FC } from "react"

import { ModalFooter } from "@/entities/ModalFooter"
import { Button, Field, Typography, useModal } from "@/shared"
import { ModalLayout } from "@/shared/layout/ModalLayout"
import { cn } from "@/shared/lib/utils/cn"
import { getTypeOfMedia } from "@/shared/lib/utils/getTypeOfMedia"
import { FileItem } from "../features/Fileitem"
import { useModelFileManager } from "../shared/hooks/modelFileManager"

interface IModalAddFileProps {}

export const ModalAddFile: FC<IModalAddFileProps> = () => {
	const { onClose, currentModal } = useModal()

	const { data } = currentModal
	const addedFiles = data?.addFiles?.files
	const chatId = data?.addFiles?.chatId
	const chatType = data?.addFiles?.chatType
	const userId = data?.addFiles?.userId

	const onClearAddedFiles = () => data?.addFiles?.onClearFiles()

	const {
		files,
		comment,
		lengthIs10,
		fileInputRef,
		isLoading,
		onAddFiles,
		onChangeComment,
		onCloseModal,
		onDeleteFile,
		onOpenInput,
		onMessageRecorderHandlers,
	} = useModelFileManager(
		addedFiles,
		chatId,
		chatType,
		userId,
		onClearAddedFiles,
		onClose
	)

	const title =
		files.length > 1 ? `${files.length} files selected` : "Send as a file"

	return (
		<ModalLayout
			onClose={() => {}}
			className="p-0 w-[350px] flex flex-col !gap-2 "
			isClickOutside={false}
			translateX={0}
		>
			<div className="flex flex-col gap-5 pt-5 px-5">
				<Typography tag="p" className="text-[16px] font-medium">
					{title}
				</Typography>

				<div className="w-full flex flex-col gap-1">
					<div className="w-full flex flex-col gap-3">
						{files?.map((file, i) => {
							const onDeleteFileHandler = () => {
								onDeleteFile(i)
							}
							console.log({ file })
							const mediasType = getTypeOfMedia(file.type)

							return (
								<FileItem
									key={i}
									name={file.name}
									size={file.size}
									type={mediasType}
									variant="uploadingFile"
									onDeleteFile={onDeleteFileHandler}
								/>
							)
						})}
					</div>

					<Field
						label="Comment"
						variant={"primary"}
						value={comment ?? ""}
						onChange={onChangeComment}
					/>
				</div>
			</div>

			<div className="flex items-center justify-between px-3">
				<Button
					variant="withoutBg"
					size="sm"
					type="button"
					className={cn(
						(lengthIs10 || isLoading) &&
							"hover:cursor-not-allowed text-gray-500"
					)}
					onClick={onOpenInput}
					disabled={lengthIs10 || isLoading}
				>
					<Typography className="text-[14px]">Add</Typography>
				</Button>

				<input
					ref={fileInputRef}
					type="file"
					onChange={onAddFiles}
					multiple
					hidden
				/>

				<ModalFooter
					onClose={onCloseModal}
					onSave={onMessageRecorderHandlers}
					isLoading={isLoading}
					isLoadingCircle={isLoading}
					type="button"
					anotherName="Send"
					className="after:h-0 px-0"
				/>
			</div>
		</ModalLayout>
	)
}
