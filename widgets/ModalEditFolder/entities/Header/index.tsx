import { cn } from "@/shared/lib/utils/cn"
import { Field } from "@/shared/ui/Field"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FC } from "react"

interface IHeaderProps {
	folderName: string | undefined
}

const CLASSNAME_UNDERLINE =
	"relative after:absolute after:w-full after:h-[1px] after:left-[0px] after:bottom-0 after:bg-[#E7E7E7] after:dark:bg-[#101921]"

export const Header: FC<IHeaderProps> = ({ folderName }) => {
	return (
		<div className={cn("flex flex-col gap-3 px-4 py-4", CLASSNAME_UNDERLINE)}>
			<Typography tag="h4" className="font-normal">
				Edit Folder
			</Typography>

			<Field label="Folder name" variant={"primary"} value={folderName} />
		</div>
	)
}
