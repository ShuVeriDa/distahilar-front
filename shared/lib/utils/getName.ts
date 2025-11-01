export const getName = (
	name: string | undefined,
	surname: string | undefined
) => {
	if (!name && !surname) return ""
	if (!name) return surname
	if (!surname) return name
	return `${name} ${surname}`
}
