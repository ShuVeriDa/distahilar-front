import { Field } from "@/shared/ui/Field"
import { useTranslations } from "next-intl"
import { FC } from "react"
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form"
import { IChangeAccountInfoInput } from "../../../../shared/hooks/useChangeAccountInfo"

interface IChangeNameProps {
	register: UseFormRegister<IChangeAccountInfoInput>
	isPending: boolean
	errors: FieldErrors<IChangeAccountInfoInput>
	watch: UseFormWatch<IChangeAccountInfoInput>
}

export const ChangeName: FC<IChangeNameProps> = ({
	register,
	isPending,
	errors,
	watch,
}) => {
	const t = useTranslations("MODALS.EDIT_NAME")
	const tValidation = useTranslations("VALIDATION")
	const tAccountInfo = useTranslations("MODALS.ACCOUNT_INFO")

	return (
		<div className="flex flex-col gap-2 px-4">
			<Field
				variant="primary"
				label={t("FIRST_NAME")}
				register={register("name", {
					required: tValidation("NAME_REQUIRED"),
					minLength: {
						value: 2,
						message: tValidation("NAME_MIN_LENGTH"),
					},
					maxLength: {
						value: 32,
						message: tValidation("NAME_MAX_LENGTH"),
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
				label={t("LAST_NAME")}
				register={register("surname", {
					required: tAccountInfo("LAST_NAME_REQUIRED"),
					minLength: {
						value: 2,
						message: tAccountInfo("LAST_NAME_MIN_LENGTH"),
					},
					maxLength: {
						value: 32,
						message: tAccountInfo("LAST_NAME_MAX_LENGTH"),
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
