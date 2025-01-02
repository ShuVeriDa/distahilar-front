import { FolderWSType } from "@/prisma/models"
import { useDispatch } from "react-redux"
import { setFolder } from "../lib/redux-store/slices/folderSlice/folderSlice"
import { useAppSelector } from "../lib/redux-store/store"

export const useFolder = () => {
	const { name, folder } = useAppSelector(state => state.folder)

	const dispatch = useDispatch()

	const onChangeFolderName = (name: string, folder: FolderWSType) => {
		dispatch(setFolder({ name, folder }))
	}

	return { currentName: name, currentFolder: folder, onChangeFolderName }
}
