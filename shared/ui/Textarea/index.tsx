import { cn } from "@/shared/lib/utils/cn"
import { ComponentProps, FC } from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import { twMerge } from "tailwind-merge"

export const TextAreaNS = {
	variants: {
		default: {
			wrapperClassName: "w-full flex flex-col gap-1 items-start relative",
			className: cn(
				"text-black outline-none w-full rounded-lg py-2 px-3 min-h-[60px] dark:bg-white/10 bg-black/10 text-[14px] dark:text-white placeholder:text-[13px]"
			),
		},
		searchV1: {
			wrapperClassName: "",
			className: "",
		},
		primary: {
			wrapperClassName: "",
			className: "",
		},
	} as const,
}

interface ITextareaProps extends ComponentProps<"textarea"> {
	register: UseFormRegisterReturn<any>
	label?: string
	id?: string
	variant?: keyof typeof TextAreaNS.variants
	labelClassName?: string
}

export const Textarea: FC<ITextareaProps> = ({
	placeholder,
	register,
	className,
	labelClassName,
	label,
	id,
	variant,
	...rest
}) => {
	const variantClassName = variant
		? TextAreaNS.variants[variant].className
		: TextAreaNS.variants.default.className

	const wrapperClassName = variant
		? TextAreaNS.variants[variant].wrapperClassName
		: TextAreaNS.variants.default.wrapperClassName

	return (
		<div className={cn(wrapperClassName)}>
			{label && (
				<label htmlFor={id} className={labelClassName}>
					{label}
				</label>
			)}
			<textarea
				className={twMerge("", variantClassName, className)}
				placeholder={placeholder}
				{...rest}
				{...register}
			/>
		</div>
	)
}
