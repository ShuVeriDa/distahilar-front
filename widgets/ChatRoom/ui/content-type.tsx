import { MessageType } from "@/prisma/models"
import { Button } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import { IconPicker } from "@/shared/ui/EmojiPicker"
import { ChangeEvent, FC, useRef } from "react"
import {
	SubmitHandler,
	UseFormHandleSubmit,
	UseFormRegister,
} from "react-hook-form"
import { ImAttachment } from "react-icons/im"
import { IoSend } from "react-icons/io5"
import { PiInstagramLogoLight, PiMicrophone, PiSmiley } from "react-icons/pi"
import TextareaAutosize from "react-textarea-autosize"
import { IFormRichMessageInput } from "../features/RichMessageInput"

interface IContentTypeProps {
	recording: boolean
	currentValue: string
	editedMessage: MessageType | null
	register: UseFormRegister<IFormRichMessageInput>
	manageVoiceRecording: () => void
	manageVideoRecording: () => void
	onAddEmoji: (icon: string) => void
	handleSubmit: UseFormHandleSubmit<
		IFormRichMessageInput,
		IFormRichMessageInput
	>
	onSubmit: SubmitHandler<IFormRichMessageInput>
	handleEditMessage: (message: MessageType | null) => void
	onAddFiles: (fileList: FileList) => void
}

export const ContentType: FC<IContentTypeProps> = ({
	currentValue,
	recording,
	editedMessage,
	onAddEmoji,
	register,
	manageVoiceRecording,
	manageVideoRecording,
	handleSubmit,
	onSubmit,
	handleEditMessage,
	onAddFiles,
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null)

	const onOpenInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
	}

	const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
		const fileValue = e.currentTarget.files
		if (fileValue) {
			onAddFiles(fileValue)
		}
	}

	return (
		<>
			<div className="w-[47px] h-full flex flex-col justify-end group">
				<Button
					variant="default"
					type="button"
					className="w-[47px] h-[47px] flex items-center justify-center"
					onClick={onOpenInput}
				>
					<ImAttachment
						size={21}
						className="fill-[#999999] group-hover:fill-[#807f7f]"
					/>
				</Button>

				<input
					ref={fileInputRef}
					type="file"
					onChange={onChangeFile}
					multiple
					hidden
				/>
			</div>

			<div className="h-full w-full flex items-center bg-red-400">
				<TextareaAutosize
					className="w-full min-h-[47px] text-[13px] resize-none outline-none py-3 placeholder:text-[14px] placeholder:!font-[400] dark:bg-[#17212B]"
					rows={1}
					maxRows={11}
					placeholder="Write a message..."
					onKeyDown={e => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault()
							handleSubmit(onSubmit)()
						}
					}}
					{...register("content", {
						onChange: e => {
							if (e.target.value === "" && editedMessage) {
								handleEditMessage(null)
							}
						},
					})}
				/>
			</div>

			<div className="h-full flex items-end">
				{!recording && (
					<Button
						variant="default"
						className={cn(
							"w-[47px]  h-[47px]  flex items-center justify-center group"
						)}
						type="button"
					>
						<IconPicker onChange={onAddEmoji}>
							<PiSmiley
								size={26}
								className="fill-[#999999] group-hover:fill-[#807f7f]"
							/>
						</IconPicker>
					</Button>
				)}

				{currentValue ? (
					<Button
						variant="default"
						className="w-[47px]  h-[47px]  flex items-center justify-center group"
						type="submit"
					>
						<IoSend size={23} className="fill-[#40A7E3] hover:fill-[#20a3ef]" />
					</Button>
				) : (
					<>
						<Button
							variant="default"
							className="w-[47px]  h-[47px]  flex items-center justify-center group"
							type="button"
							onClick={manageVoiceRecording}
						>
							<PiMicrophone
								size={26}
								className="fill-[#999999] group-hover:fill-[#807f7f]"
							/>
						</Button>
						<Button
							variant="default"
							className="w-[47px]  h-[47px]  flex items-center justify-center group"
							type="button"
							onClick={manageVideoRecording}
						>
							<PiInstagramLogoLight
								size={26}
								className="fill-[#999999] group-hover:fill-[#807f7f]"
							/>
						</Button>
					</>
				)}
			</div>
		</>
	)
}
