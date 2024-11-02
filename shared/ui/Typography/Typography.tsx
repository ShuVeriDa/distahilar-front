import { ComponentProps, ReactNode, Ref, forwardRef } from "react"
import { twMerge } from "tailwind-merge"

type TypographyTag =
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "div"
	| "p"
	| "span"

export type TypographyProps<Tag extends TypographyTag = "div"> = Omit<
	ComponentProps<Tag>,
	"ref"
> & {
	tag?: Tag
	children: ReactNode
	className?: string
}

export const Typography = forwardRef(
	<Tag extends TypographyTag = "div">(
		{ tag, children, className, ...props }: TypographyProps<Tag>,
		ref: Ref<HTMLElement>
	) => {
		const Component = tag || "div"
		const DEFAULT_CLASSES = twMerge("")

		return (
			<Component
				ref={ref as Ref<any>}
				className={twMerge(className, DEFAULT_CLASSES)}
				{...props}
			>
				{children}
			</Component>
		)
	}
)

Typography.displayName = "Typography"
