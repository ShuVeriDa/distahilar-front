"use client"

import { useFolderQuery } from "@/shared/lib/services/folder/useFolderQuery"
import { IconRenderer } from "@/shared/ui/IconRenderer"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FC } from "react"
import { SheetComponent } from "../SheetComponent/SheetComponent"

interface ILeftBarProps {}

export const LeftBar: FC<ILeftBarProps> = () => {
	const { fetchFoldersQuery } = useFolderQuery()
	const { data, isSuccess, isLoading } = fetchFoldersQuery

	return (
		<div className="w-[70px] dark:bg-[rgb(0,0,0,0.13)] flex flex-col items-center">
			{isLoading && <p>Loading...</p>}
			<SheetComponent />
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
		</div>
	)
}
