import { Field } from "@/shared/ui/Field"
import { FC } from "react"
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form"

interface IChangeNameProps {
	register: UseFormRegister<any>
	isPending: boolean
	errors: FieldErrors<any>
	watch: UseFormWatch<any>
}

export const ChangeName: FC<IChangeNameProps> = ({
	register,
	isPending,
	errors,
	watch,
}) => {
	return (
		<div className="flex flex-col gap-2 px-4">
			<Field
				variant="primary"
				label="First name"
				register={register("name", {
					required: "Name is required",
					minLength: {
						value: 2,
						message: "Name must be at least 2 characters long",
					},
					maxLength: {
						value: 32,
						message: "Name must be no more than 32 characters long",
					},
				})}
				minLength={2}
				maxLength={32}
				disabled={isPending}
				errors={errors.name}
				watch={watch}
			/>
			<Field
				variant="primary"
				label="Last name"
				register={register("surname", {
					required: "Last name is required",
					minLength: {
						value: 2,
						message: "Last name must be at least 2 characters long",
					},
					maxLength: {
						value: 32,
						message: "Last name must be no more than 32 characters long",
					},
				})}
				minLength={2}
				maxLength={32}
				disabled={isPending}
				errors={errors.surname}
				watch={watch}
			/>
		</div>
	)
}
