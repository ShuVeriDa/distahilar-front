import { Button } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import { IconPicker } from "@/shared/ui/EmojiPicker"
import { FC } from "react"
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
	register: UseFormRegister<IFormRichMessageInput>
	manageRecording: () => void
	onAddEmoji: (icon: string) => void
	handleSubmit: UseFormHandleSubmit<IFormRichMessageInput, undefined>
	onSubmit: SubmitHandler<IFormRichMessageInput>
}

export const ContentType: FC<IContentTypeProps> = ({
	currentValue,
	recording,
	onAddEmoji,
	register,
	manageRecording,
	handleSubmit,
	onSubmit,
}) => {
	return (
		<>
			<div className="w-[47px] h-full flex flex-col justify-end">
				<Button
					variant="default"
					type="button"
					className="w-[47px] h-[47px] flex items-center justify-center"
				>
					<ImAttachment
						size={21}
						className="fill-[#999999] hover:fill-[#807f7f]"
					/>
				</Button>
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
					{...register("content")}
				/>
			</div>

			<div className="h-full flex items-end">
				{!recording && (
					<Button
						variant="default"
						className={cn(
							"w-[47px]  h-[47px]  flex items-center justify-center"
						)}
						type="button"
					>
						<IconPicker onChange={onAddEmoji}>
							<PiSmiley
								size={26}
								className="fill-[#999999] hover:fill-[#807f7f]"
							/>
						</IconPicker>
					</Button>
				)}

				{currentValue ? (
					<Button
						variant="default"
						className="w-[47px]  h-[47px]  flex items-center justify-center"
						type="submit"
					>
						<IoSend size={23} className="fill-[#40A7E3] hover:fill-[#20a3ef]" />
					</Button>
				) : (
					<>
						<Button
							variant="default"
							className="w-[47px]  h-[47px]  flex items-center justify-center"
							type="button"
							onClick={manageRecording}
						>
							<PiMicrophone
								size={26}
								className="fill-[#999999] hover:fill-[#807f7f]"
							/>
						</Button>
						<Button
							variant="default"
							className="w-[47px]  h-[47px]  flex items-center justify-center"
							type="button"
						>
							<PiInstagramLogoLight
								size={26}
								className="fill-[#999999] hover:fill-[#807f7f]"
							/>
						</Button>
					</>
				)}
			</div>
		</>
	)
}
