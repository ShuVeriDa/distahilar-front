export interface InitiateCallDto {
	chatId: string
	isVideoCall?: boolean
}

export interface CallResponseDto {
	callId: string
	action: CallActionEnum
}

export interface CallEndDto {
	callId: string
}

export enum CallActionEnum {
	ACCEPT = "accept",
	REJECT = "reject",
}

export enum CallStatusEnum {
	INITIATED = "initiated",
	RINGING = "ringing",
	ACTIVE = "active",
	ENDED = "ended",
}

export interface CallNotification {
	callId: string
	callerId: string
	callerName: string
	chatId: string
	chatName: string
	isVideoCall: boolean
	timestamp: number
}

export interface CallStatus {
	id: string
	chatId: string
	callerId: string
	participantIds: string[]
	status: CallStatusEnum
	isVideoCall: boolean
	startedAt: Date
	endedAt?: Date
}

// Обновляем CallResponse чтобы соответствовать реальным ответам с бэкенда
export interface CallResponse {
	callId: string
	status: CallStatusEnum | "rejected" // Бэкенд возвращает либо enum, либо строку "rejected"
	callerId: string
	participantIds: string[]
	roomName?: string
	tokens?: Record<string, string>
	endedBy?: string // Для endCall response
}

export interface ICallTokenResponse {
	token: string
	roomName: string
}

export interface JoinVoiceChatResponse {
	token: string
	roomName: string
}

// WebRTC signaling types (to align with backend DTOs)
export enum CallTypeEnum {
	OFFER = "offer",
	ANSWER = "answer",
}

export interface WebRtcOfferDto {
	callId: string
	toUserId: string
	sdp: string
	type: CallTypeEnum.OFFER
}

export interface WebRtcAnswerDto {
	callId: string
	toUserId: string
	sdp: string
	type: CallTypeEnum.ANSWER
}

export interface WebRtcIceCandidateDto {
	callId: string
	toUserId: string
	candidate: RTCIceCandidateInit
}

export enum CallPhaseEnum {
	IDLE = "idle",
	INCOMING = "incoming",
	CALLING = "calling",
	CONNECTING = "connecting",
	ACTIVE = "active",
	ENDED = "ended",
}

export type LiveParticipantType = {
	userId: string
	name?: string
	imageUrl?: string
	role: string
	micOn: boolean
}
