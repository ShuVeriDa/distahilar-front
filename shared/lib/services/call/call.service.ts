import { getCallUrl } from "../../axios/api.config"
import { instance } from "../../axios/axios"
import {
	CallEndDto,
	CallResponse,
	CallResponseDto,
	ICallTokenResponse,
	InitiateCallDto,
	JoinVoiceChatResponse,
} from "./call.types"

export const callService = {
	// Старые методы для совместимости
	async enterCallRoom(roomId: string) {
		const { data } = await instance.get<ICallTokenResponse>(
			getCallUrl(`/${roomId}`)
		)
		return data
	},

	async kickUser(roomName: string, userId: string) {
		const { data } = await instance.post<{ message: string }>(
			getCallUrl("/kick"),
			{ roomName, userId }
		)
		return data
	},

	async muteUser(roomName: string, userId: string, isMuted: boolean) {
		const { data } = await instance.post<{ message: string }>(
			getCallUrl("/mute"),
			{ roomName, userId, isMuted }
		)
		return data
	},

	// Новые методы для WebSocket звонков (эти вызовы будут через WebSocket)
	// Эти методы используются только если WebSocket недоступен
	async initiateCallHTTP(dto: InitiateCallDto) {
		const { data } = await instance.post<CallResponse>(
			getCallUrl("/initiate"),
			dto
		)
		return data
	},

	async respondToCallHTTP(dto: CallResponseDto) {
		const { data } = await instance.post<CallResponse>(
			getCallUrl("/respond"),
			dto
		)
		return data
	},

	async endCallHTTP(dto: CallEndDto) {
		const { data } = await instance.post<CallResponse>(getCallUrl("/end"), dto)
		return data
	},

	async joinVoiceChat(chatId: string) {
		const { data } = await instance.post<JoinVoiceChatResponse>(
			getCallUrl("/voice-chat"),
			{ chatId }
		)
		return data
	},
}
