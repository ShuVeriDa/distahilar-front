import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/Select/select"
import { FC, useState } from "react"

interface IChooseLanguageProps {
	ref?: React.RefObject<HTMLDivElement>
}

export const ChooseLanguage: FC<IChooseLanguageProps> = ({ ref }) => {
	const [language, setLanguage] = useState<"en" | "ru" | "che">("en")

	const handleLanguageChange = (newLanguage: "en" | "ru" | "che") => {
		setLanguage(newLanguage)
	}

	const langName = {
		en: "English",
		ru: "Русский",
		che: "Нохчийн",
	}

	return (
		<Select>
			<SelectTrigger className="w-auto border-none">
				<SelectValue placeholder={langName[language]} defaultValue={language} />
			</SelectTrigger>
			<SelectContent className="!z-[100]" ref={ref}>
				<SelectItem value="en" onClick={() => handleLanguageChange("en")}>
					{langName.en}
				</SelectItem>
				<SelectItem value="ru" onClick={() => handleLanguageChange("ru")}>
					{langName.ru}
				</SelectItem>
				<SelectItem value="che" onClick={() => handleLanguageChange("che")}>
					{langName.che}
				</SelectItem>
			</SelectContent>
		</Select>
	)
}
