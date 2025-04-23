"use client"

import type { ComponentProps, FC, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export const ButtonNS = {
	variants: {
		withoutBg:
			"bg-transition h-[36px] text-[#1689DC] dark:text-[#6AB2F2] hover:bg-[rgba(106,139,172,0.2)] hover:dark:bg-[rgba(23,63,103,0.2)",
		primary: "bg-blue-500 hover:bg-blue-600 text-white text-[16px]",
		default: "w-fit h-fit p-0",
		blue: "bg-[#40A7E3] hover:bg-[#289adb] text-white gap-1 text-[13px] rounded-sm px-3 py-1.5",
		clean: "p-0",
	} as const,

	size: {
		md: "h-10 rounded-sm px-4 py-2",
		sm: "h-9 rounded-sm px-3",
		lg: "h-11 rounded-md px-8",
		default: "",
		// icon: "h-10 w-10",
	} as const,
}

interface ButtonProps extends ComponentProps<"button"> {
	children: ReactNode
	size?: keyof typeof ButtonNS.size
	variant?: keyof typeof ButtonNS.variants
}

export const Button: FC<ButtonProps> = ({ ...props }) => {
	const { children, className, variant, size, ...rest } = props

	const DEFAULT_VARIANT = "flex items-center justify-center cursor-pointer"

	const variantClassName = variant
		? ButtonNS.variants[variant]
		: ButtonNS.variants.default

	const sizeClassName = size ? ButtonNS.size[size] : ButtonNS.size.default

	return (
		<button
			className={twMerge(
				variantClassName,
				sizeClassName,
				className,
				DEFAULT_VARIANT
			)}
			{...rest}
		>
			{children}
		</button>
	)
}
