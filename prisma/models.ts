import { Prisma } from "@prisma/client"

export type UserType = Prisma.UserGetPayload<{
	include: Prisma.UserInclude
}> & {
	settings: UserSettingsType
	contactSaver: ContactType[]
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
	lengthUnread: number | null
	// isChat: boolean;
	lastSeen?: Date | null
	isOnline?: boolean | undefined | null
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

export type VoiceVideoMessageType = {
	id: string
	createdAt: Date
	url: string
	size?: number
	duration: number
	messageId: string | null
}

export type VideoMessageType = Prisma.VideoMessageGetPayload<{
	include: Prisma.VideoMessageInclude
}>

export type ReactionType = Prisma.ReactionGetPayload<{
	include: Prisma.ReactionInclude
}> & {
	user: UserType
}

export type ReactionTypeFromMessage = {
	id: string
	userId: string
	emoji: string
	count: number
	messageId: string
	user: UserType
}

export type FolderWSType = {
	id: string
	name: string
	imageUrl: string
	chats: FoundedChatsType[]
	userId: string
	user?: UserType
}

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

// export enum MediaType {
// 	IMAGE,
// 	VIDEO,
// 	VOICE,
// 	FILE,
// }

export enum MessageEnum {
	TEXT = "TEXT",
	VIDEO = "VIDEO",
	VOICE = "VOICE",
	FILE = "FILE",
}

export enum ChatRole {
	DIALOG = "DIALOG",
	CHANNEL = "CHANNEL",
	GROUP = "GROUP",
}

export enum MessageStatus {
	PENDING = "PENDING",
	SENT = "SENT",
	READ = "READ",
}
