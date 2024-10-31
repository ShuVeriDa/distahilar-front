import { passwordPattern } from "@/shared/lib/utils/patterns"
import { Button } from "@/shared/ui/Button/button"
import { Field } from "@/shared/ui/Field"
import { FC } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

interface IFormInput {
	username: string
	password: string
}

interface ILoginProps {}

export const Login: FC<ILoginProps> = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<IFormInput>()

	const onSubmit: SubmitHandler<IFormInput> = async data => {
		console.log({ data })
		reset()
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-col gap-3 w-[300px]">
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
				<Button
					className="bg-blue-500 hover:bg-blue-600 text-white text-[16px]"
					type="submit"
				>
					Sign in
				</Button>
			</div>
		</form>
	)
}
