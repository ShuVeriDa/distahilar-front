import { useAppSelector } from "../lib/redux-store/store"

export const useUser = () => {
	const { user } = useAppSelector(state => state.user)
	const fullName = `${user?.name} ${user?.surname}`

	return { user, fullName }
}
