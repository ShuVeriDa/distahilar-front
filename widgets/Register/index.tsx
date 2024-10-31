import { emailPattern, passwordPattern } from "@/shared/lib/utils/patterns"
import { Button } from "@/shared/ui/Button/button"
import { Field } from "@/shared/ui/Field"
import { FC } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

interface IFormInput {
	username: string
	password: string
	name: string
	email: string
	bio: string
	phone: string
}

interface IRegisterProps {}

export const Register: FC<IRegisterProps> = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
	} = useForm<IFormInput>()

	const onSubmit: SubmitHandler<IFormInput> = async data => {
		console.log({ data })
		reset()
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-col gap-3 w-[300px]">
				<Field
					type="email"
					placeholder="Email"
					register={register("email", {
						required: "Email is required",
						pattern: emailPattern,
					})}
					errors={errors.email}
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
					errors={errors.password}
				/>
				<Field
					type="text"
					placeholder="Username"
					minLength={2}
					maxLength={16}
					register={register("username", {
						required: "Username is required",
					})}
					errors={errors.username}
				/>

				<Field
					type="name"
					placeholder="name"
					register={register("name", {
						required: "Name is required",
					})}
					minLength={2}
					maxLength={32}
					errors={errors.name}
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
				/>

				<Field
					placeholder="Bio"
					register={register("bio", {
						required: "Bio is required",
					})}
					isType="textarea"
					errors={errors.bio}
					maxLength={70}
				/>

				<Button className="bg-blue-500 hover:bg-blue-600 text-white">
					Sign up
				</Button>
			</div>
		</form>
	)
}
