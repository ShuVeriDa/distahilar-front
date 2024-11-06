import { cn } from "@/shared/lib/utils/cn"
import { FC, InputHTMLAttributes } from "react"
import {
	FieldError,
	FieldErrorsImpl,
	Merge,
	UseFormRegisterReturn,
} from "react-hook-form"
import { Input } from "../Input"
import { Textarea } from "../Textarea"
import { Typography } from "../Typography/Typography"

interface IFieldProps extends InputHTMLAttributes<HTMLInputElement> {
	register: UseFormRegisterReturn<any>
	errors: Merge<FieldError, FieldErrorsImpl<{ value: number }>> | undefined
	colorScheme?: string
	isType?: "input" | "textarea"
	label?: string
	classNameLabel?: string
	className?: string
	classNameField?: string
}

export const Field: FC<IFieldProps> = ({ isType = "input", ...props }) => {
	const {
		placeholder,
		register,
		errors,
		type,
		onChange,
		label,
		classNameLabel,
		className,
		classNameField,
		...rest
	} = props

	return (
		<div className={cn("w-full flex flex-col gap-0.5", classNameField)}>
			{label && (
				<Typography tag="p" className={cn(classNameLabel)}>
					{label}
				</Typography>
			)}

			{isType === "input" ? (
				<Input
					placeholder={placeholder}
					type={type}
					register={register}
					onChange={onChange}
					className={className}
					{...rest}
				/>
			) : (
				<Textarea
					className={className}
					placeholder={placeholder}
					register={register}
					{...rest}
				/>
			)}

			{errors && (
				<Typography tag="span" className={"text-[12px] text-[#ff0000]"}>
					{errors.message}
				</Typography>
			)}
		</div>
	)
}
