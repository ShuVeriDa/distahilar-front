import { useMutation } from "@tanstack/react-query"
import { useMemo } from "react"
import { useDispatch } from "react-redux"
import { setLanguage } from "../../redux-store/slices/user-slice/userSlice"
import { userService } from "./user.service"
import { IChangeSettingsRequest } from "./user.types"

export const useUserQuery = () => {
	const dispatch = useDispatch()
	// const client = useQueryClient()

	const changeSettings = useMutation({
		mutationFn: async (data: IChangeSettingsRequest) =>
			userService.changeSettings(data),
		mutationKey: ["changeSettings"],
		onSuccess: data => {
			dispatch(setLanguage(data.settings.language))
		},
	})

	return useMemo(() => ({ changeSettings }), [changeSettings])
}
