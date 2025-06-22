export const formatFileName = (name: string, start = 12, end = 8) => {
	const [filename, extension] = name.split(/\.(?=[^\.]+$)/)
	if (filename.length <= start + end) return name
	return `${filename.slice(0, start)}...${filename.slice(-end)}.${extension}`
}
