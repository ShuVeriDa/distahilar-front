import { cn } from "@/shared/lib/utils/cn"
import { FC, InputHTMLAttributes } from "react"
import {
	FieldError,
	FieldErrorsImpl,
	Merge,
	UseFormRegisterReturn,
	UseFormWatch,
} from "react-hook-form"
import { Input, InputNS } from "../Input"
import { Textarea, TextAreaNS } from "../Textarea"
import { Typography } from "../Typography/Typography"

interface IFieldProps
	extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
	register?: UseFormRegisterReturn<any>
	errors?: Merge<FieldError, FieldErrorsImpl<{ value: number }>> | undefined
	colorScheme?: string
	isType?: "input" | "textarea"
	label?: string
	classNameLabel?: string
	className?: string
	classNameField?: string
	id?: string
	variant?: keyof typeof InputNS.variants | keyof typeof TextAreaNS.variants
	watch?: UseFormWatch<any>
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
		id,
		variant,
		...rest
	} = props

	return (
		<div className={cn("w-full", classNameField)}>
			{isType === "input" ? (
				<Input
					placeholder={placeholder}
					type={type}
					register={register}
					onChange={onChange}
					className={className}
					classNameLabel={classNameLabel}
					label={label}
					id={id}
					variant={variant}
					errors={errors}
					watch={rest.watch}
					{...rest}
				/>
			) : (
				<Textarea
					label={label}
					id={id}
					variant={variant}
					className={className}
					placeholder={placeholder}
					register={register}
					{...rest}
				/>
			)}

			{errors && variant !== "primary" && (
				<Typography tag="span" className={"text-[12px] text-[#ff0000]"}>
					{errors.message}
				</Typography>
			)}
		</div>
	)
}
