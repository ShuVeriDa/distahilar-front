import { useFolderQuery } from "@/shared/lib/services/folder/useFolderQuery"
import { cn } from "@/shared/lib/utils/cn"
import { Skeleton } from "@/shared/ui/Skeleton/skeleton"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FolderItem } from "../../shared/ui/FolderItem"

interface IMyFoldersProps {}

export const MyFolders = ({}: IMyFoldersProps) => {
	const { fetchFoldersQuery } = useFolderQuery()
	const { data, isSuccess, isLoading } = fetchFoldersQuery

	return (
		<div className="w-full  flex flex-col">
			<div className="px-5 py-4">
				<Typography tag="h5" className="text-[#168AD6] font-normal text-[16px]">
					My folders
				</Typography>
			</div>
			<div className="flex flex-col gap-1 w-full">
				{isLoading && (
					<>
						<MyFolders.Skeleton />
						<MyFolders.Skeleton />
						<MyFolders.Skeleton />
					</>
				)}
				{isSuccess &&
					data
						.filter(folder => folder.name !== "All chats")
						.map(folder => {
							return (
								<FolderItem
									key={folder.id}
									{...folder}
									chatLength={folder.chats.length}
								/>
							)
						})}
			</div>
		</div>
	)
}

MyFolders.Skeleton = function MyFolders() {
	return (
		<div
			className={cn(
				"flex gap-1 px-5 h-[60px] !w-full !justify-between items-center"
			)}
		>
			<div className="flex gap-6 items-center">
				<div>
					<Skeleton className="w-[25px] h-[25px] bg-gray-500" />
				</div>
				<div className="flex flex-col gap-0.5 text-start w-full">
					<Skeleton className="h-[12px] w-[100px] bg-gray-500" />
					<Skeleton className="h-[12px] w-full bg-gray-500" />
				</div>
			</div>
			<div>
				<Skeleton className="h-[25px] w-[25px] rounded-full bg-gray-500" />
			</div>
		</div>
	)
}
