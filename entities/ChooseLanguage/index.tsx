import { EnumLanguage } from "@/prisma/models"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/Select/select"
import { FC } from "react"
import { useLang } from "./shared/hooks/useLang"

interface IChooseLanguageProps {
	ref?: React.RefObject<HTMLDivElement>
}

export const ChooseLanguage: FC<IChooseLanguageProps> = ({ ref }) => {
	const { language, handleLanguageChange, langName } = useLang()

	return (
		<Select
			value={langName[language!].tag}
			onValueChange={(value: EnumLanguage) => handleLanguageChange(value)}
		>
			<SelectTrigger
				className="w-auto border-none text-[#5288C1]"
				defaultValue={langName[language!].name}
				value={langName[language!].name}
			>
				<SelectValue
					placeholder={langName[language!].name}
					defaultValue={language}
				/>
			</SelectTrigger>
			<SelectContent className="!z-[110]" ref={ref}>
				{Object.values(langName).map(obj => (
					<SelectItem
						key={obj.tag}
						value={obj.tag}
						onClick={() => handleLanguageChange(obj.tag)}
					>
						{obj.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
