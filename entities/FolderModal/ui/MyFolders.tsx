import { useModal } from "@/shared/hooks/useModal"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"

import {
	useDeleteFolderById,
	useFetchFolders,
} from "@/shared/lib/services/folder/useFolderQuery"
import { cn } from "@/shared/lib/utils/cn"
import { Button } from "@/shared/ui/Button"
import { Skeleton } from "@/shared/ui/Skeleton/skeleton"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FolderItem } from "@/widgets/ModalFolder/shared/ui/FolderItem"
import { useTranslations } from "next-intl"
import { FaPlus } from "react-icons/fa"

interface IMyFoldersProps {}

function MyFoldersSkeleton() {
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

export const MyFolders = ({}: IMyFoldersProps) => {
	const { onOpenModal } = useModal()
	const t = useTranslations("MODALS.FOLDERS")

	const { data, isSuccess, isLoading } = useFetchFolders()
	const { mutateAsync: deleteFolderMutate } = useDeleteFolderById()

	const onOpenCreateFolder = () => onOpenModal(EnumModel.CREATE_FOLDER)

	return (
		<div className="w-full  flex flex-col">
			<div className="px-5 py-4">
				<Typography tag="h5" className="text-[#168ACD] font-normal text-[16px]">
					{t("MY_FOLDERS")}
				</Typography>
			</div>
			<div className="flex flex-col gap-1 w-full pb-2">
				{isLoading && (
					<>
						<MyFolders.Skeleton />
						<MyFoldersSkeleton />
						<MyFoldersSkeleton />
					</>
				)}
				{isSuccess &&
					data
						.filter(folder => folder.name !== "All chats")
						.map(folder => {
							const onClick = () => {
								onOpenModal(EnumModel.EDIT_FOLDER, {
									folderManage: { folder: folder, isFetching: true },
								})
							}

							const onDeleteFolder = async () => {
								await deleteFolderMutate(folder.id)
							}
							return (
								<FolderItem
									key={folder.id}
									{...folder}
									chatLength={folder.chats.length}
									onClick={onClick}
									onDeleteFolder={onDeleteFolder}
								/>
							)
						})}

				<Button
					className={cn(
						"flex gap-1 px-5 h-[40px] !w-full !justify-between hover:bg-[#F1F1F1] dark:hover:bg-[#232E3C]"
					)}
					onClick={onOpenCreateFolder}
				>
					<div className="flex gap-5 items-center">
						<div className="w-[20px] h-[20px] flex items-center justify-center">
							<div className="flex items-center justify-center w-[20px] h-[20px] rounded-full text-white font-bold bg-[#5288C1]">
								<FaPlus size={10} />
							</div>
						</div>

						<div className="flex flex-col gap-0.5 text-start">
							<Typography
								tag="p"
								className="text-[14px] font-normal text-[#71a3d8]"
							>
								{t("CREATE_NEW_FOLDER")}
							</Typography>
						</div>
					</div>
				</Button>
			</div>
		</div>
	)
}

MyFolders.Skeleton = function MyFoldersSkeleton() {
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
