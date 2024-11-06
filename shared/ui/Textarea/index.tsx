import { ComponentProps, FC } from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import { twMerge } from "tailwind-merge"

interface ITextareaProps extends ComponentProps<"textarea"> {
	register: UseFormRegisterReturn<any>
}

export const Textarea: FC<ITextareaProps> = ({
	placeholder,
	register,
	className,
	...rest
}) => {
	const DEFAULT_CLASSES =
		"text-black outline-none w-full rounded-lg py-2 px-3 min-h-[60px] dark:bg-white/10 bg-black/10 text-[14px] dark:text-white placeholder:text-[13px]"

	return (
		<textarea
			className={twMerge("", DEFAULT_CLASSES, className)}
			placeholder={placeholder}
			{...rest}
			{...register}
		/>
	)
}
