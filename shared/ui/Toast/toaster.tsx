"use client"

import { useToast } from "@/hooks/use-toast"
import {
	Toast,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "@/shared/ui/Toast/toast"

export function Toaster() {
	const { toasts } = useToast()

	return (
		<ToastProvider>
			{toasts.map(function ({ id, title, description, action, ...props }) {
				return (
					<Toast
						key={id}
						{...props}
						className="bg-black/70 px-4 py-2 border-0 rounded-sm "
					>
						<div className="grid gap-1 text-white ">
							{title && (
								<ToastTitle className="text-[12px]">{title}</ToastTitle>
							)}
							{description && (
								<ToastDescription className="text-[12px]">
									{description}
								</ToastDescription>
							)}
						</div>
						{action}
						{/* <ToastClose  /> */}
					</Toast>
				)
			})}
			<ToastViewport className="md:max-w-auto w-auto top-[50%] sm:bottom-[50%] sm:right-[50%] sm:top-auto sm:flex-col" />
		</ToastProvider>
	)
}
