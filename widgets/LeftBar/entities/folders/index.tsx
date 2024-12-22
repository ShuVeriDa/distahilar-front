"use client"

import { useModal } from "@/shared/hooks/useModal"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"

import { useFolder } from "@/shared/hooks/useFolder"
import { useFetchFoldersWS } from "@/shared/lib/services/folder/useFolderQuery"
import { FC } from "react"
import { FolderItem } from "../folderItem"

interface IFoldersProps {}

export const Folders: FC<IFoldersProps> = () => {
	const { onOpenModal } = useModal()
	const { onChangeFolderName, currentName: folderName } = useFolder()

	const { data, isSuccess, isLoading } = useFetchFoldersWS()
	console.log({ data })

	const onOpen = () => onOpenModal(EnumModel.FOLDERS)

	return (
		<div className="flex flex-col gap-0.5">
			{isLoading && <p>Loading...</p>}
			{isSuccess &&
				data.map(folder => {
					const onChange = () => {
						onChangeFolderName(folder.name, folder)
					}
					return (
						<FolderItem
							key={folder.id}
							imageUrl={folder.imageUrl!}
							name={folder.name}
							isActiveFolder={folderName === folder.name}
							size={25}
							onChange={onChange}
						/>
					)
				})}

			<FolderItem
				imageUrl={"Settings"}
				name={"Edit"}
				size={30}
				onChange={onOpen}
			/>
		</div>
	)
}
