import { Button } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import { IconRenderer } from "@/shared/ui/IconRenderer"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FC } from "react"

interface IFolderItemProps {
	imageUrl: string
	name: string
	size: number
	isActiveFolder?: boolean
	onChange?: () => void
}

export const FolderItem: FC<IFolderItemProps> = ({
	imageUrl,
	name,
	size = 25,
	onChange,
	isActiveFolder,
}) => {
	return (
		<Button
			onClick={onChange}
			className={cn(
				"group w-[64px] min-h-[64px] py-[11px] ga rounded flex flex-col gap-1 justify-center items-center hover:bg-white/10 cursor-pointer",
				isActiveFolder && "bg-white/10"
			)}
		>
			<div>
				<IconRenderer
					iconName={imageUrl as string}
					className={cn(
						"group-hover:[&>path]:fill-[#5BB0F0] [&>path]:fill-[#8393A3]",
						isActiveFolder && "[&>path]:fill-[#5BB0F0]"
					)}
					size={size}
				/>
			</div>
			<Typography
				tag="p"
				className={cn(
					"text-[12px] text-white/40 text-center group-hover:text-[#5BB0F0]",
					isActiveFolder && "text-[#5BB0F0]"
				)}
			>
				{name}
			</Typography>
		</Button>
	)
}
