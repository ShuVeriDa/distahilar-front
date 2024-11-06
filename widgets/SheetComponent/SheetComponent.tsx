import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/ui/Sheet/sheet"
import { Typography } from "@/shared/ui/Typography/Typography"
import Image from "next/image"
import { FC, useState } from "react"
import { IoMdMenu } from "react-icons/io"
import { SheetLinks } from "./entities/Links"
import { CopyClickBoard } from "./features/clickboard"

interface ISheetComponentProps {}

export const SheetComponent: FC<ISheetComponentProps> = () => {
	const [isOpen, setIsOpen] = useState(false)

	const closeSheet = () => setIsOpen(false)
	return (
		<div className="w-12 h-12 flex flex-col justify-center items-center ">
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetTrigger>
					<IoMdMenu className="w-5 h-5 dark:[&>path]:fill-white" />
				</SheetTrigger>
				<SheetContent className="flex flex-col gap-2">
					<SheetHeader className="hidden">
						<SheetTitle></SheetTitle>
					</SheetHeader>

					<div className="flex flex-col gap-2 relative p-5 pb-0">
						<div className="flex gap-2.5 items-center">
							<div>
								<Image
									src={"/images/icon.png"}
									alt={"avatar"}
									width={60}
									height={60}
									className={"rounded-full"}
								/>
							</div>

							<div className="flex flex-col items-start gap-1">
								<Typography tag="h1" className="text-[14px] font-normal">
									ShuVeriDa
								</Typography>

								<CopyClickBoard />
							</div>
						</div>

						<div className="h-[1px] w-full left-[-24px] dark:bg-[#2c3241] bg-gray-300" />
					</div>
					{/* <ThemeToggle /> */}

					<SheetLinks closeSheet={closeSheet} />
				</SheetContent>
			</Sheet>
		</div>
	)
}
