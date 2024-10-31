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
}

export const Field: FC<IFieldProps> = ({ isType = "input", ...props }) => {
	const { placeholder, register, errors, type, onChange, ...rest } = props

	return (
		<div className="flex flex-col gap-1">
			{isType === "input" ? (
				<Input
					placeholder={placeholder}
					type={type}
					register={register}
					onChange={onChange}
					{...rest}
				/>
			) : (
				<Textarea placeholder={placeholder} register={register} {...rest} />
			)}

			{errors && (
				<Typography tag="span" className={"text-[12px] text-[#ff0000]"}>
					{errors.message}
				</Typography>
			)}
		</div>
	)
}
