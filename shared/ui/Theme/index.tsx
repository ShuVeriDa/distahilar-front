"use client"

import { useTheme } from "next-themes"

import { Switch } from "../Switch/switch"

export function ThemeToggle() {
	const { theme, setTheme } = useTheme()

	const onToggleTheme = () => {
		if (theme === "dark") {
			setTheme("light")
		} else if (theme === "light") {
			setTheme("dark")
		}
	}

	return (
		// <DropdownMenu>
		// 	<DropdownMenuTrigger className="flex items-center">
		<Switch checked={theme === "dark"} onClick={onToggleTheme} />
		// 	</DropdownMenuTrigger>
		// </DropdownMenu>
	)
}
