"use client"

import { useFolderQuery } from "@/shared/lib/services/folder/useFolderQuery"
import { IconRenderer } from "@/shared/ui/IconRenderer"
import { Typography } from "@/shared/ui/Typography/Typography"
import { FC } from "react"
<<<<<<< HEAD
import { SheetComponent } from "../SheetComponent/SheetComponent"

=======
>>>>>>> 322ac8b6f85eaa05ec569855eab495147caa8f64
interface ILeftBarProps {}

export const LeftBar: FC<ILeftBarProps> = () => {
	const { fetchFoldersQuery } = useFolderQuery()
	const { data, isSuccess, isLoading } = fetchFoldersQuery

	return (
<<<<<<< HEAD
		<div className="w-[70px] dark:bg-[rgb(0,0,0,0.13)] flex flex-col items-center">
			{isLoading && <p>Loading...</p>}
			<SheetComponent />
=======
		<div className="w-[70px] bg-black/13 flex flex-col items-center">
			{isLoading && <p>Loading...</p>}
>>>>>>> 322ac8b6f85eaa05ec569855eab495147caa8f64
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
<<<<<<< HEAD
								className="text-[12px] dark:text-white/40 text-center group-hover:text-[#0F80D7]"
=======
								className="text-[12px] text-white/40 text-center group-hover:text-[#0F80D7]"
>>>>>>> 322ac8b6f85eaa05ec569855eab495147caa8f64
							>
								{folder.name}
							</Typography>
						</div>
					)
				})}
		</div>
	)
}
