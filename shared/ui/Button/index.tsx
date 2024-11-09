"use client"

import type { ComponentProps, FC } from "react"
import { twMerge } from "tailwind-merge"

export const ButtonNS = {
	variants: {
		withoutBg:
			"bg-transition h-[36px] text-[#168ACD] dark:text-[#5DB2F2] hover:bg-[rgba(106,139,172,0.2)] hover:dark:bg-[rgba(23,63,103,0.2)",
		primary: "bg-blue-500 hover:bg-blue-600 text-white text-[16px]",
		default: "h-fit w-fit p-0",
	} as const,

	size: {
		default: "h-10 rounded-sm px-4 py-2",
		sm: "h-9 rounded-md px-3",
		lg: "h-11 rounded-md px-8",
		// icon: "h-10 w-10",
	} as const,
}

interface ButtonProps extends ComponentProps<"button"> {
	title: string
	size?: keyof typeof ButtonNS.size
	variant?: keyof typeof ButtonNS.variants
}

export const Button: FC<ButtonProps> = ({ ...props }) => {
	const { title, className, variant, size, ...rest } = props

	const DEFAULT_VARIANT = ""

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
			{title}
		</button>
	)
}
