import { ChatMemberType, MemberRole } from "@/prisma/models"
import { useMemo } from "react"

export function useMemberPermissions(
	members?: ChatMemberType[],
	myUserId?: string
) {
	const myRole = useMemo(() => {
		if (!members || !myUserId) return undefined
		return members.find(m => m.userId === myUserId)?.role as
			| MemberRole
			| undefined
	}, [members, myUserId])

	const canPromote = myRole === MemberRole.OWNER || myRole === MemberRole.ADMIN
	const canRemove = myRole === MemberRole.OWNER

	return { myRole, canPromote, canRemove }
}
