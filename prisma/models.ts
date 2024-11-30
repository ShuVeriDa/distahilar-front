import { Prisma } from "@prisma/client"

export type UserType = Prisma.UserGetPayload<{
	include: Prisma.UserInclude
}> & {
	settings: UserSettingsType
}

export type UserSettingsType = Prisma.UserSettingsGetPayload<{
	include: Prisma.UserSettingsInclude
}>

export type FoundedChatsType = {
	chatId: string
	name: string
	imageUrl: string
	lastMessage: MessageType | null
	lastMessageDate: Date | null
	// isChat: boolean;
	type: ChatRole
}

export type ChatType = Prisma.ChatGetPayload<{
	include: Prisma.ChatInclude
}> & {
	members: ChatMemberType[]
}

export type ChatMemberType = Prisma.ChatMemberGetPayload<{
	include: Prisma.ChatMemberInclude
}> & {
	user: UserType
}

export type MessageType = Prisma.MessageGetPayload<{
	include: Prisma.MessageInclude
}>

export type MediaType = Prisma.MediaGetPayload<{
	include: Prisma.MediaInclude
}>

export type VoiceMessageType = Prisma.VoiceMessageGetPayload<{
	include: Prisma.VoiceMessageInclude
}>

export type VideoMessageType = Prisma.VideoMessageGetPayload<{
	include: Prisma.VideoMessageInclude
}>

export type ReactionType = Prisma.ReactionGetPayload<{
	include: Prisma.ReactionInclude
}>

export type FolderType = Prisma.FolderGetPayload<{
	include: Prisma.FolderInclude
}> & { chats: ChatType[] }

export type AuditLogType = Prisma.AuditLogGetPayload<{
	include: Prisma.AuditLogInclude
}>

export type ContactType = Prisma.ContactGetPayload<{
	include: Prisma.ContactInclude
}>

export enum MemberRole {
	OWNER,
	ADMIN,
	MODERATOR,
	GUEST,
}
export enum EnumLanguage {
	EN = "EN",
	RU = "RU",
	CHE = "CHE",
}

export enum MediaType {
	IMAGE,
	VIDEO,
	VOICE,
	FILE,
}

export enum MessageType {
	TEXT,
	VIDEO,
	VOICE,
	FILE,
}

export enum ChatRole {
	DIALOG = "DIALOG",
	CHANNEL = "CHANNEL",
	GROUP = "GROUP",
}
