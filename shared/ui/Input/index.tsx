"use client"

import { cn } from "@/shared/lib/utils/cn"
import { ComponentProps, forwardRef, useImperativeHandle, useRef } from "react"
import { UseFormRegisterReturn } from "react-hook-form"

type InputRefType = HTMLInputElement | null

export type PropsType = {
	register: UseFormRegisterReturn<any>
} & ComponentProps<"input">

export const Input = forwardRef<InputRefType, PropsType>((props, ref) => {
	const { disabled, className, value, type, register, ...rest } = props
	const inputRef = useRef<InputRefType>(null)

	useImperativeHandle<InputRefType, InputRefType>(
		ref,
		() => inputRef.current,
		[]
	)

	const DEFAULT_CLASSES =
		"text-black outline-none text-[14px] w-full h-[40px] rounded-lg py-2 px-3 dark:bg-white/10 bg-black/10 dark:text-white placeholder:text-[13px]"

	const DEFAULT_WRAPPER_LASSES = "w-full"

	return (
		<div className={cn(DEFAULT_WRAPPER_LASSES)}>
			<input
				// ref={inputRef}
				disabled={disabled}
				className={cn(DEFAULT_CLASSES, className)}
				value={value}
				type={type}
				{...rest}
				{...register}
			/>
		</div>
	)
})

Input.displayName = Input.name
