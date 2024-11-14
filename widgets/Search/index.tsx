import { Input, InputNS } from "@/shared/ui/Input"
import { ComponentProps, FC } from "react"
import { UseFormRegisterReturn } from "react-hook-form"

interface ISearchProps extends ComponentProps<"input"> {
	register?: UseFormRegisterReturn<any>
	variant?: keyof typeof InputNS.variants
}

export const Search: FC<ISearchProps> = ({ ...rest }) => {
	const { register } = rest
	return (
		<Input
			variant={rest.variant}
			type="search"
			className="input-search"
			{...rest}
			{...register}
		/>
	)
}
