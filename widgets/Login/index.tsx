import { useAuthQuery } from "@/shared/lib/services/auth/useAuthQuery"
import { passwordPattern } from "@/shared/lib/utils/patterns"
import { Button } from "@/shared/ui/Button"
import { Field } from "@/shared/ui/Field"
import { FC } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { VscLoading } from "react-icons/vsc"

interface IFormInput {
	username: string
	password: string
}

interface ILoginProps {}

export const Login: FC<ILoginProps> = () => {
	const { login } = useAuthQuery()
	const { mutateAsync, isPending, isSuccess } = login

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
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
				<Button variant="primary" type="submit">
					{isPending || isSuccess ? (
						<VscLoading className="animate-spin" />
					) : (
						"Sign in"
					)}
				</Button>
			</div>
		</form>
	)
}
