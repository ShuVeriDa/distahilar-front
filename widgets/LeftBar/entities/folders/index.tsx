import { useModal } from "@/shared/hooks/useModal"
import { EnumModel } from "@/shared/lib/redux-store/slices/model-slice/type"

import { useFetchFolders } from "@/shared/lib/services/folder/useFolderQuery"
import { Button } from "@/shared/ui/Button"
import { FC } from "react"
import { FolderItem } from "../folderItem"

interface IFoldersProps {}

export const Folders: FC<IFoldersProps> = () => {
	const { onOpenModal } = useModal()

	const { data, isSuccess, isLoading } = useFetchFolders()

	const onOpen = () => onOpenModal(EnumModel.FOLDERS)

	return (
		<>
			{isLoading && <p>Loading...</p>}
			{isSuccess &&
				data.map(folder => {
					return (
						<FolderItem
							key={folder.id}
							imageUrl={folder.imageUrl!}
							name={folder.name}
							size={25}
						/>
					)
				})}
			<Button onClick={onOpen}>
				<FolderItem imageUrl={"Settings"} name={"Edit"} size={30} />
			</Button>
		</>
	)
}
