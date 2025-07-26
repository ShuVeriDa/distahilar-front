import { useMutation, useQueryClient } from "@tanstack/react-query"
import { callService } from "./call.service"
import { CallEndDto, CallResponseDto, InitiateCallDto } from "./call.types"

export const useEnterCallRoom = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ roomId }: { roomId: string }) =>
			callService.enterCallRoom(roomId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["call"] })
		},
	})
}

export const useKickUser = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ roomName, userId }: { roomName: string; userId: string }) =>
			callService.kickUser(roomName, userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["call"] })
		},
	})
}

export const useMuteUser = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			roomName,
			userId,
			isMuted,
		}: {
			roomName: string
			userId: string
			isMuted: boolean
		}) => callService.muteUser(roomName, userId, isMuted),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["call"] })
		},
	})
}

// Новые хуки для WebSocket звонков
export const useInitiateCall = () => {
	return useMutation({
		mutationFn: (dto: InitiateCallDto) => callService.initiateCallHTTP(dto),
	})
}

export const useRespondToCall = () => {
	return useMutation({
		mutationFn: (dto: CallResponseDto) => callService.respondToCallHTTP(dto),
	})
}

export const useEndCall = () => {
	return useMutation({
		mutationFn: (dto: CallEndDto) => callService.endCallHTTP(dto),
	})
}

export const useJoinVoiceChat = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ chatId }: { chatId: string }) =>
			callService.joinVoiceChat(chatId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["voice-chat"] })
		},
	})
}
