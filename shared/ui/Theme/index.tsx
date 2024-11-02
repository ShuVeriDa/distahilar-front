"use client"

import { useTheme } from "next-themes"

import {
	DropdownMenu,
	DropdownMenuTrigger,
} from "@/shared/ui/Dropdown-menu/dropdown-menu"
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
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center">
				<Switch data-state="checked" onClick={onToggleTheme} />
			</DropdownMenuTrigger>
		</DropdownMenu>
	)
}
