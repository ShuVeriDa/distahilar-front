"use client"

import { cn } from "@/shared/lib/utils/cn"
import {
	ComponentProps,
	forwardRef,
	useImperativeHandle,
	useRef,
	useState,
} from "react"
import {
	FieldError,
	FieldErrorsImpl,
	Merge,
	UseFormRegisterReturn,
	UseFormWatch,
} from "react-hook-form"
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
			className: cn("w-full py-2 text-base bg-transparent  focus:outline-none"),
		},
		accountInfo: {
			wrapperClassName: "",
			className: cn(""),
		},
	} as const,
}

export type PropsType = {
	register?: UseFormRegisterReturn<any>
	variant?: keyof typeof InputNS.variants
	classNameLabel?: string
	label?: string
	id?: string
	errors?: Merge<FieldError, FieldErrorsImpl<{ value: number }>> | undefined
	watch?: UseFormWatch<any>
} & ComponentProps<"input">

export const Input = forwardRef<InputRefType, PropsType>((props, ref) => {
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
		errors,
		watch,
		...rest
	} = props

	const [focused, setFocused] = useState(false)
	const currentValue = value
		? value
		: watch
		? watch(register?.name as string)
		: value

	const inputRef = useRef<InputRefType>(null)

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
					`!text-[14px] font-semibold absolute left-0 top-1/2 -translate-y-1/2 transform transition-all duration-200 ease-in-out`,
					focused || currentValue
						? "!text-[13px] -top-[4px] text-[#6AB2F2]"
						: "text-base text-[#989798] dark:text-[#5C6E81]",
					currentValue && "text-[#989798] dark:text-[#5C6E81]",
					focused && currentValue && "text-[#6AB2F2]",
					errors?.message && "text-red-500",
					classNameLabel
			  )
			: cn("!text-[14px]", classNameLabel)

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
					className={cn(
						variantClassName,
						className,
						variant === "primary" && errors?.message
							? "border-b border-[#ff0000]"
							: "border-b border-[#E0E0E0] dark:border-[#313C49]"
					)}
					value={value ?? undefined}
					type={type}
					{...rest}
					{...register}
					onFocus={onFocus}
					onBlur={onBlur}
				/>

				<div
					className={cn(
						"absolute bottom-0 left-0 h-[2px] w-full bg-[#439DF3] transform scale-x-0 transition-transform duration-300 origin-center",
						focused && "scale-x-100",
						variant !== "primary" && "hidden",
						variant === "primary" && errors?.message && "bg-[#ff0000]"
					)}
				/>
			</div>
		</div>
	)
})

Input.displayName = Input.name
