"use client"

import { cn } from "@/shared/lib/utils/cn"
import {
	ComponentProps,
	forwardRef,
	useImperativeHandle,
	useRef,
	useState,
} from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import { LiaSearchSolid } from "react-icons/lia"

type InputRefType = HTMLInputElement | null

const DEFAULT_WRAPPER_CLASSES =
	"w-full flex flex-col gap-1 items-start relative"
const DEFAULT_CLASSES =
	"text-black dark:text-white outline-none text-[14px] w-full h-[40px] rounded-lg placeholder:text-[13px]"

export const InputNS = {
	variants: {
		default: {
			wrapperClassName: DEFAULT_WRAPPER_CLASSES,
			className: cn("py-2 px-3 dark:bg-white/10 bg-black/10", DEFAULT_CLASSES),
		},
		searchV1: {
			wrapperClassName: DEFAULT_WRAPPER_CLASSES,
			className: cn("pl-8 pr-2 dark:bg-transparent", DEFAULT_CLASSES),
		},
		primary: {
			wrapperClassName: "relative mt-4 w-full",
			className: cn(
				"w-full py-2 text-base bg-transparent border-b border-[#313C49] focus:outline-none"
			),
		},
	} as const,
}

export type PropsType = {
	register?: UseFormRegisterReturn<any>
	variant?: keyof typeof InputNS.variants
	classNameLabel?: string
	label?: string
	id?: string
} & ComponentProps<"input">

export const Input = forwardRef<InputRefType, PropsType>((props, ref) => {
	const inputRef = useRef<InputRefType>(null)

	const {
		disabled,
		className,
		value,
		type,
		register,
		variant,
		label,
		id,
		classNameLabel,
		...rest
	} = props
	const [focused, setFocused] = useState(false)

	const onFocus = () => setFocused(true)
	const onBlur = () => setFocused(false)

	useImperativeHandle<InputRefType, InputRefType>(
		ref,
		() => inputRef.current,
		[]
	)

	const variantClassName = variant
		? InputNS.variants[variant].className
		: InputNS.variants.default.className

	const wrapperClassName = variant
		? InputNS.variants[variant].wrapperClassName
		: InputNS.variants.default.wrapperClassName

	const labelClassName =
		variant === "primary"
			? cn(
					`text-[14px] font-semibold absolute left-0 top-1/2 -translate-y-1/2 transform transition-all duration-200 ease-in-out`,
					focused || value
						? "text-[13px] -top-[4px] text-[#439DF3]"
						: "text-base text-[#5C6E81]",
					value && "text-[#5C6E81]",
					focused && value && "text-[#439DF3]",
					classNameLabel
			  )
			: cn("text-[14px]", classNameLabel)

	return (
		<div className={cn(wrapperClassName)}>
			{label && (
				<label htmlFor={id} className={labelClassName}>
					{label}
				</label>
			)}

			{variant === "searchV1" && (
				<div className="absolute">
					<LiaSearchSolid color="gray" size={18} />
				</div>
			)}
			<div className="relative w-full">
				<input
					id={id}
					// ref={inputRef}
					disabled={disabled}
					className={cn(variantClassName, className)}
					value={value}
					type={type}
					onFocus={onFocus}
					onBlur={onBlur}
					{...rest}
					{...register}
				/>

				<div
					className={cn(
						"absolute bottom-0 left-0 h-[2px] w-full bg-[#439DF3] transform scale-x-0 transition-transform duration-300 origin-center",
						focused && "scale-x-100",
						variant !== "primary" && "hidden"
					)}
				/>
			</div>
		</div>
	)
})

Input.displayName = Input.name
