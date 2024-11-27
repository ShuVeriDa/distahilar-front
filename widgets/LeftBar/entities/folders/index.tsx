import { useFolderQuery } from "@/shared/lib/services/folder/useFolderQuery"
import { IconRenderer } from "@/shared/ui/IconRenderer"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FC } from "react"

interface IFoldersProps {}

export const Folders: FC<IFoldersProps> = () => {
	const { fetchFoldersQuery } = useFolderQuery()

	const { data, isSuccess, isLoading } = fetchFoldersQuery
	return (
		<>
			{isLoading && <p>Loading...</p>}
			{isSuccess &&
				data.map(folder => {
					return (
						<div
							key={folder.id}
							className="group w-[64px] min-h-[64px] py-[11px] ga rounded flex flex-col gap-1 justify-center items-center hover:bg-white/10 cursor-pointer"
						>
							<div className="w-[20px] h-[20px]">
								<IconRenderer
									iconName={folder?.imageUrl as string}
									className={"group-hover:[&>path]:fill-[#0F80D7]"}
								/>
							</div>
							<Typography
								tag="p"
								className="text-[12px] dark:text-white/40 text-center group-hover:text-[#0F80D7]"
							>
								{folder.name}
							</Typography>
						</div>
					)
				})}
		</>
	)
}
