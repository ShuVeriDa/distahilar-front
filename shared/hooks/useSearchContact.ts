import { useDebounceValue } from "@siberiacancode/reactuse"
import { ChangeEvent, useState } from "react"
import { useContactQuery } from "../lib/services/contact/useContactQuery"

export const useSearchContact = (isModalOpen?: boolean) => {
	const [value, setValue] = useState<string>("")
	const debouncedValue = useDebounceValue(value, 500)

	const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.currentTarget.value)
	}

	const { searchContactsQuery } = useContactQuery(
		undefined,
		debouncedValue,
		isModalOpen
	)
	const { data: contacts, isSuccess } = searchContactsQuery

	return {
		value,
		isSuccess,
		debouncedValue,
		onChangeValue,
		contacts,
	}
}
