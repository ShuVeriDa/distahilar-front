export enum LiveRoleEnum {
	HOST = "host",
	SPEAKER = "speaker",
	LISTENER = "listener",
}

export interface LiveRoomState {
	chatId: string
	isLive: boolean
	hostId: string | null
	speakers: string[]
	listeners: string[]
	raisedHands: string[]
	muted: string[]
	startedAt?: number
}

export type LiveUserId = string

export interface LivePeerInfo {
	userId: string
	role: LiveRoleEnum
	isMuted: boolean
}

// WS DTOs
export class StartLiveDto {
	chatId!: string
}

export class StopLiveDto {
	chatId!: string
}

export class JoinLiveDto {
	chatId!: string
}

export class LeaveLiveDto {
	chatId!: string
}

export class RaiseHandDto {
	chatId!: string
}

export class ApproveSpeakerDto {
	chatId!: string
	userId!: string
}

export class RevokeSpeakerDto {
	chatId!: string
	userId!: string
}

export class ToggleMuteDto {
	chatId!: string
	userId!: string
	isMuted!: boolean
}

export class GetLiveRoomStateDto {
	chatId!: string
}

// Live WebRTC signaling DTOs
export enum LiveCallTypeEnum {
	OFFER = "offer",
	ANSWER = "answer",
}

export interface LiveWebRtcOfferDto {
	chatId: string
	toUserId: string
	sdp: string
	type: LiveCallTypeEnum.OFFER
}

export interface LiveWebRtcAnswerDto {
	chatId: string
	toUserId: string
	sdp: string
	type: LiveCallTypeEnum.ANSWER
}

export interface LiveWebRtcIceCandidateDto {
	chatId: string
	toUserId: string
	candidate: RTCIceCandidateInit
}

// Client-side state helpers
export type LiveAudience = {
	hostId: string | null
	speakers: string[]
	listeners: string[]
	raisedHands: string[]
	muted: string[]
}

export type LivePublishCapability = {
	canPublishAudio: boolean
	canPublishVideo: boolean
}
