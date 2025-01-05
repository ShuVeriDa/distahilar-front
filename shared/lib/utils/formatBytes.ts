export const formatBytes = (bytes: number): string => {
	if (bytes < 1024) return `${bytes} B`

	const sizes = ["KB", "MB", "GB"]
	let size = bytes

	for (const unit of sizes) {
		size /= 1024
		if (size < 1024) {
			return `${size.toFixed(1)} ${unit}`
		}
	}

	return `${size.toFixed(1)} GB`
}
