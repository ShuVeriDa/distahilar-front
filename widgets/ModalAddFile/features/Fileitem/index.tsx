import { Button, Typography } from "@/shared"
import { formatFileName } from "@/shared/hooks/formatFileName"
import { formatBytes } from "@/shared/lib/utils/formatBytes"
import { FC } from "react"
import { BiSolidFileBlank } from "react-icons/bi"
import { MdDelete } from "react-icons/md"

interface IFileItemProps {
	file: File
	onDeleteFile: () => void
}

export const FileItem: FC<IFileItemProps> = ({ file, onDeleteFile }) => {
	const size = formatBytes(file.size)

	return (
		<div className="w-full min-h-11 flex gap-3 pr-5">
			<div className="w-full h-full max-w-11 flex items-center justify-center ">
				<div className="w-full h-full max-h-11 flex items-center justify-center rounded-full bg-[#40A7E3]">
					<BiSolidFileBlank className="w-6 h-6" color="white" />
				</div>
			</div>

			<div className="w-full flex items-end ">
				<div className="w-full flex justify-between ">
					<div className="flex flex-col gap-0.5">
						<Typography tag="p" className="text-[12px] font-medium">
							{formatFileName(file.name)}
						</Typography>

						<Typography
							tag="p"
							className="text-[12px] font-[300] text-[#A0ACB6]"
						>
							{size}
						</Typography>
					</div>
					<Button onClick={onDeleteFile} className="hover:cursor-pointer">
						<MdDelete
							size={20}
							className="text-[#999999] hover:text-[#858484]"
						/>
					</Button>
				</div>
			</div>
		</div>
	)
}
