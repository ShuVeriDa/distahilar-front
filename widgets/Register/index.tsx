import { useAuthQuery } from "@/shared/lib/services/auth/useAuthQuery"
import { emailPattern, passwordPattern } from "@/shared/lib/utils/patterns"
import { Button } from "@/shared/ui/Button"
import { Field } from "@/shared/ui/Field"
import { useTranslations } from "next-intl"
import { FC } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { VscLoading } from "react-icons/vsc"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

interface IFormInput {
	username: string
	password: string
	name: string
	surname: string
	email: string
	phone: string
	bio?: string
}

interface IRegisterProps {}

export const Register: FC<IRegisterProps> = () => {
	const { register: registerAuth } = useAuthQuery()
	const { mutateAsync, isPending, isSuccess } = registerAuth
	const t = useTranslations("COMMON")
	const tValidation = useTranslations("VALIDATION")

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
	} = useForm<IFormInput>()

	const onSubmit: SubmitHandler<IFormInput> = async data => {
		await mutateAsync(data)
		reset()
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-col gap-2 w-[300px]">
				<Field
					type="text"
					placeholder={t("USERNAME")}
					minLength={2}
					maxLength={16}
					register={register("username", {
						required: tValidation("USERNAME_REQUIRED"),
					})}
					disabled={isPending}
					errors={errors.username}
				/>

				<Field
					type="password"
					placeholder={t("PASSWORD")}
					minLength={6}
					register={register("password", {
						required: true,
						minLength: {
							value: 6,
							message: tValidation("PASSWORD_REQUIRED"),
						},
						pattern: passwordPattern,
					})}
					disabled={isPending}
					errors={errors.password}
				/>

				<Field
					type="email"
					placeholder={t("EMAIL")}
					register={register("email", {
						required: tValidation("EMAIL_REQUIRED"),
						pattern: emailPattern,
					})}
					disabled={isPending}
					errors={errors.email}
				/>

				<Field
					type="text"
					placeholder={t("NAME")}
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
				/>

				<Field
					type="text"
					placeholder={t("SURNAME")}
					register={register("surname", {
						required: tValidation("SURNAME_REQUIRED"),
					})}
					minLength={2}
					maxLength={32}
					disabled={isPending}
					errors={errors.surname}
				/>

				<Controller
					control={control}
					name="phone"
					rules={{ required: tValidation("PHONE_REQUIRED") }}
					render={({ field }) => (
						<PhoneInput
							country={"ru"}
							value={field.value}
							onChange={field.onChange}
							dropdownClass="dark:!bg-[#252322] !bg-[#E5E5E5]"
							buttonClass="dark:!bg-[#252322] !bg-[#cdcaca] !border-none !hover:!bg-red-500"
							inputClass="dark:!bg-[#252322] !bg-[#E5E5E5] !border-none !h-10"
							searchClass="dark:!bg-[#252322] !bg-[#E5E5E5]"
							containerClass="dark:!bg-[#252322] !bg-[#E5E5E5] !rounded-lg dark:!text-white"
						/>
					)}
					disabled={isPending}
				/>

				<Field
					placeholder={t("BIO")}
					register={register("bio")}
					isType="textarea"
					errors={errors.bio}
					maxLength={70}
					disabled={isPending}
				/>

				<Button variant="primary" type="submit" size="md">
					{isPending || isSuccess ? (
						<VscLoading className="animate-spin" />
					) : (
						t("SIGN_UP")
					)}
				</Button>
			</div>
		</form>
	)
}
