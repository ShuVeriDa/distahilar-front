import { ChatMemberType } from "@/prisma/models"
import { useMemo, useState } from "react"

export function useMembersFiltering(initialList: ChatMemberType[] = []) {
	const [query, setQuery] = useState("")

	const filteredMembers = useMemo(() => {
		if (!query.trim()) return initialList
		const q = query.toLowerCase()
		return (initialList || []).filter(m => {
			const name = `${m.user?.name ?? ""} ${m.user?.surname ?? ""}`.trim()
			const username = m.user?.username ?? ""
			return (
				name.toLowerCase().includes(q) || username.toLowerCase().includes(q)
			)
		})
	}, [initialList, query])

	return { query, setQuery, filteredMembers }
}
