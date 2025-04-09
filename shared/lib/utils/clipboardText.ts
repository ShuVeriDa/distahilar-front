export const writeClipboardText = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text)
	} catch (error) {
		console.error(error)
	}
}
