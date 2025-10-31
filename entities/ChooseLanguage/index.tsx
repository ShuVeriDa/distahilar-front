import { EnumLanguage } from "@/prisma/models"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/Select/select"
import { forwardRef } from "react"
import { useLang } from "./shared/hooks/useLang"

interface IChooseLanguageProps {}

export const ChooseLanguage = forwardRef<HTMLDivElement, IChooseLanguageProps>(
	(_props, ref) => {
		const { language, handleLanguageChange, langName } = useLang()

		// Проверка на существование языка
		if (!language || !langName[language]) {
			return null
		}

		return (
			<Select
				value={langName[language].tag}
				onValueChange={(value: EnumLanguage) => handleLanguageChange(value)}
			>
				<SelectTrigger className="w-auto border-none text-[#5288C1]">
					<SelectValue placeholder={langName[language].name} />
				</SelectTrigger>
				<SelectContent className="!z-[110]" ref={ref}>
					{Object.values(langName).map(obj => (
						<SelectItem key={obj.tag} value={obj.tag}>
							{obj.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		)
	}
)

ChooseLanguage.displayName = "ChooseLanguage"
