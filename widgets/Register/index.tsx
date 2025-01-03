import { useAuthQuery } from "@/shared/lib/services/auth/useAuthQuery"
import { emailPattern, passwordPattern } from "@/shared/lib/utils/patterns"
import { Button } from "@/shared/ui/Button"
import { Field } from "@/shared/ui/Field"
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
					placeholder="Username"
					minLength={2}
					maxLength={16}
					register={register("username", {
						required: "Username is required",
					})}
					disabled={isPending}
					errors={errors.username}
				/>

				<Field
					type="password"
					placeholder="Password"
					minLength={6}
					register={register("password", {
						required: true,
						minLength: {
							value: 6,
							message: "Password must be at least 6 characters",
						},
						pattern: passwordPattern,
					})}
					disabled={isPending}
					errors={errors.password}
				/>

				<Field
					type="email"
					placeholder="Email"
					register={register("email", {
						required: "Email is required",
						pattern: emailPattern,
					})}
					disabled={isPending}
					errors={errors.email}
				/>

				<Field
					type="text"
					placeholder="Name"
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
				/>

				<Field
					type="text"
					placeholder="Surname"
					register={register("surname", {
						required: "Surname is required",
					})}
					minLength={2}
					maxLength={32}
					disabled={isPending}
					errors={errors.surname}
				/>

				<Controller
					control={control}
					name="phone"
					rules={{ required: "phone is required" }}
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
					placeholder="Bio (not required)"
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
						"Sign up"
					)}
				</Button>
			</div>
		</form>
	)
}
