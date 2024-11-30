import { useUser } from "@/shared/hooks/useUser"
import { cn } from "@/shared/lib/utils/cn"
import { Typography } from "@/shared/ui/Typography/Typography"
import { CopyClickBoard } from "@/widgets/SheetComponent/features/clickboard"
import Image from "next/image"
import { FC } from "react"
import { twMerge } from "tailwind-merge"

export const ModalHeaderInfoNS = {
	variants: {
		sheet: {
			rootClassName: "gap-2.5",
			avatar: {
				width: 60,
				height: 60,
			},
			fullName: {
				className: "text-[14px] font-normal",
			},
		},

		settings: {
			rootClassName: "gap-4",
			avatar: {
				width: 80,
				height: 80,
			},
			fullName: {
				className: "text-[20px] font-normal",
			},
			phone: {
				className: "text-[14px] font-normal",
			},
		},
	} as const,
}

interface IModalHeaderInfoProps {
	classNameAvatar?: string
	variant: keyof typeof ModalHeaderInfoNS.variants
}

export const ModalHeaderInfo: FC<IModalHeaderInfoProps> = ({
	classNameAvatar,
	variant = "sheet",
}) => {
	const { user, fullName } = useUser()

	const variantValue = ModalHeaderInfoNS.variants[variant]

	return (
		<div className={cn("flex items-center", variantValue.rootClassName)}>
			<div
				className={twMerge(`flex w-full h-full`)}
				style={{
					maxWidth: `${variantValue.avatar.width}px`,
					maxHeight: `${variantValue.avatar.height}px`,
				}}
			>
				<Image
					src={user?.imageUrl || "/images/no-avatar.png"}
					alt={`${fullName || "User"} avatar`}
					className={cn(`w-full h-full rounded-full`, classNameAvatar)}
					width={variantValue.avatar.width}
					height={variantValue.avatar.height}
					loading="lazy"
				/>
			</div>

			<div className="w-full flex flex-col items-start gap-1 overflow-hidden">
				<Typography
					tag="h1"
					className={cn(
						variantValue.fullName.className,
						"truncate overflow-hidden whitespace-nowrap max-w-full"
					)}
				>
					{fullName}
				</Typography>

				{variant === "settings" && (
					<Typography
						tag="h2"
						className={cn(
							ModalHeaderInfoNS.variants["settings"].phone.className
						)}
					>
						{user?.phone}
					</Typography>
				)}

				<CopyClickBoard />
			</div>
		</div>
	)
}
