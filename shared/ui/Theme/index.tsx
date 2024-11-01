"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/shared/ui/Button/button"
import {
	DropdownMenu,
	DropdownMenuTrigger,
} from "@/shared/ui/Dropdown-menu/dropdown-menu"

export function ThemeToggle() {
	const { theme, setTheme } = useTheme()

	const onTogleTheme = () => {
		if (theme === "dark") {
			setTheme("light")
		} else if (theme === "light") {
			setTheme("dark")
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild onClick={onTogleTheme}>
				<Button variant="outline" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
		</DropdownMenu>
	)
}
