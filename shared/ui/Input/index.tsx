"use client"

import { cn } from "@/shared/lib/utils/cn"
import { ComponentProps, forwardRef, useImperativeHandle, useRef } from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import { LiaSearchSolid } from "react-icons/lia"

type InputRefType = HTMLInputElement | null
export const ButtonNS = {
	variants: {
		default: {
			className: "py-2 px-3 dark:bg-white/10 bg-black/10 ",
		},
		searchV1: {
			className: "pl-8 pr-2 dark:bg-transparent",
		},
	} as const,
}

export type PropsType = {
	register?: UseFormRegisterReturn<any>
	variant?: keyof typeof ButtonNS.variants
} & ComponentProps<"input">

export const Input = forwardRef<InputRefType, PropsType>((props, ref) => {
	const { disabled, className, value, type, register, variant, ...rest } = props
	const inputRef = useRef<InputRefType>(null)

	useImperativeHandle<InputRefType, InputRefType>(
		ref,
		() => inputRef.current,
		[]
	)

	const DEFAULT_WRAPPER_LASSES = "w-full flex items-center relative"
	const DEFAULT_CLASSES =
		"text-black dark:text-white outline-none text-[14px] w-full h-[40px] rounded-lg placeholder:text-[13px] "

	const variantClassName = variant
		? ButtonNS.variants[variant].className
		: ButtonNS.variants.default.className

	return (
		<div className={cn(DEFAULT_WRAPPER_LASSES)}>
			{variant === "searchV1" && (
				<div className="absolute">
					<LiaSearchSolid color="gray" size={18} />
				</div>
			)}
			<input
				// ref={inputRef}
				disabled={disabled}
				className={cn(variantClassName, DEFAULT_CLASSES, className)}
				value={value}
				type={type}
				{...rest}
				{...register}
			/>
		</div>
	)
})

Input.displayName = Input.name
