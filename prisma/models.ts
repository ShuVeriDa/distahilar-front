import { Prisma } from "@prisma/client"

export type UserType = Prisma.UserGetPayload<{
	include: Prisma.UserInclude
}>

export type UserSettingsType = Prisma.UserSettingsGetPayload<{
	include: Prisma.UserSettingsInclude
}>

export type ChatType = Prisma.ChatGetPayload<{
	include: Prisma.ChatInclude
}>

export type ChatMemberType = Prisma.ChatMemberGetPayload<{
	include: Prisma.ChatMemberInclude
}>

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
}>

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
export enum Language {
	EN,
	RU,
	CHE,
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
