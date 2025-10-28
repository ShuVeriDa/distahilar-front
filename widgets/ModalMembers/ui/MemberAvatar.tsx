"use client"

import Image from "next/image"
import { FC, useState } from "react"

export const MemberAvatar: FC<{ src?: string; alt: string }> = ({
	src,
	alt,
}) => {
	const fallback = "/images/no-avatar.png"
	const [imgSrc, setImgSrc] = useState<string>(
		src && src.trim() ? src : fallback
	)
	return (
		<Image
			src={imgSrc}
			alt={alt}
			width={32}
			height={32}
			className="h-8 w-8 object-cover"
			unoptimized
			onError={() => {
				if (imgSrc !== fallback) setImgSrc(fallback)
			}}
		/>
	)
}
