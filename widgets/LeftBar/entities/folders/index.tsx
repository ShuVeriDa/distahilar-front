"use client"

import { useModal } from "@/shared/hooks/useModal"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"

import { useFolder } from "@/shared/hooks/useFolder"
import { useFetchFoldersWS } from "@/shared/lib/services/folder/useFolderQuery"
import { getFolderName } from "@/widgets/ModalFolder/shared/utils/folders-name"
import { useTranslations } from "next-intl"
import { FC } from "react"
import { FolderItem } from "../folderItem"

interface IFoldersProps {}

export const Folders: FC<IFoldersProps> = () => {
	const t = useTranslations()
	const tFolders = useTranslations("MODALS.FOLDERS")
	const { onOpenModal } = useModal()
	const { onChangeFolderName, currentName: folderName } = useFolder()

	const { data, isSuccess, isLoading } = useFetchFoldersWS()

	const onOpen = () => onOpenModal(EnumModel.FOLDERS)

	return (
		<div className="flex flex-col gap-0.5 w-full">
			{isLoading && (
				<>
					<FolderItem.Skeleton />
					<FolderItem.Skeleton />
				</>
			)}
			{isSuccess &&
				data.map(folder => {
					const nameOfEditFolder = getFolderName(
						folder?.name ?? "",
						tFolders
					) as string
					const onChange = () => {
						onChangeFolderName(folder.name, folder)
					}
					return (
						<FolderItem
							key={folder.id}
							imageUrl={folder.imageUrl!}
							name={nameOfEditFolder}
							isActiveFolder={folderName === folder.name}
							size={25}
							onChange={onChange}
						/>
					)
				})}

			<FolderItem
				imageUrl={"Settings"}
				name={t("PAGES.CHAT.OPTIONS.EDIT")}
				size={30}
				onChange={onOpen}
			/>
		</div>
	)
}
