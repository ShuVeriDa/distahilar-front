import { FC } from "react"

import { cn } from "@/shared/lib/utils/cn"
import { Field } from "@/shared/ui/Field"

import { IconsRendererType } from "@/shared/ui/IconRenderer/data"
import { Typography } from "@/shared/ui/Typography/Typography"
import { HoverCardWrapper } from "@/widgets/HoverCardWrapper"

interface IHeaderFolderManagerProps {
	title: string
	folderName: string | undefined
	iconUrl: string | null | undefined
	onChangeFolderName: (e: React.ChangeEvent<HTMLInputElement>) => void
	onChangeIcon: (icon: IconsRendererType) => void
}

const CLASSNAME_UNDERLINE =
	"relative after:absolute after:w-full after:h-[1px] after:left-[0px] after:bottom-0 after:bg-[#E7E7E7] after:dark:bg-[#101921]"

export const HeaderFolderManager: FC<IHeaderFolderManagerProps> = ({
	title,
	folderName,
	onChangeFolderName,
	iconUrl,
	onChangeIcon,
}) => {
	console.log("HeaderFolderManager")

	return (
		<div
			className={cn(
				"relative flex flex-col gap-3 px-4 py-4 ",
				CLASSNAME_UNDERLINE
			)}
		>
			<Typography tag="h4" className="font-normal">
				{title}
			</Typography>

			<div className="relative">
				<Field
					label="Folder name"
					variant={"primary"}
					value={folderName}
					onChange={onChangeFolderName}
					maxLength={12}
				/>

				<HoverCardWrapper iconUrl={iconUrl} onChangeIcon={onChangeIcon} />
			</div>
		</div>
	)
}
