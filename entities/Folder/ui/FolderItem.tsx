import { Button, Skeleton } from "@/shared"
import { cn } from "@/shared/lib/utils/cn"
import { IconRenderer } from "@/shared/ui/IconRenderer"
import { Typography } from "@/shared/ui/Typography/Typography"

interface IFolderItemProps {
	imageUrl: string
	name: string
	size: number
	isActiveFolder?: boolean
	onChange?: () => void
}

export const FolderItem = ({
	imageUrl,
	name,
	size = 25,
	onChange,
	isActiveFolder,
}: IFolderItemProps) => {
	return (
		<Button
			onClick={onChange}
			className={cn(
				"group min-w-[70px] w-full min-h-[64px] py-[11px] flex flex-col gap-1 justify-center items-center hover:bg-white/10 cursor-pointer",
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

FolderItem.Skeleton = function FolderItemSkeleton() {
	return (
		<Skeleton className="min-w-[70px] w-full min-h-[64px] py-[11px] flex flex-col gap-1 justify-center items-center cursor-pointer rounded-none bg-[#202B38]">
			<div className="max-h-[25px] max-w-[25px] w-full h-full">
				<Skeleton className="w-full h-full rounded-full bg-[#F1F1F1] dark:bg-[#202B38]" />
			</div>
			<div>
				<Skeleton className="h-[10px] w-[50px] rounded-full bg-[#F1F1F1] dark:bg-[#202B38]" />
			</div>
		</Skeleton>
	)
}
