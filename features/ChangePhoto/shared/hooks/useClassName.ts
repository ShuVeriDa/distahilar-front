export const ChangePhotoNS = {
	variants: {
		default: {
			wrapper: "flex flex-col",
			button: "w-20 h-20",
			image: {
				width: 80,
				height: 80,
				alt: "change-avatar",
			},
			defaultImage: 40,
		},
		accountInfo: {
			wrapper: "flex",
			button: "w-[100px] h-[100px]",
			image: {
				width: 100,
				height: 100,
				alt: "",
			},
			defaultImage: 50,
		},
	} as const,
}

export enum ENUM_VARIANT_PHOTO {
	DEFAULT = "default",
	ACCOUNT_INFO = "accountInfo",
}

export const useClassName = (variant?: keyof typeof ChangePhotoNS.variants) => {
	const WRAPPER = variant
		? ChangePhotoNS.variants[variant].wrapper
		: ChangePhotoNS.variants.default.wrapper

	const DEFAULT_VARIANT_BUTTON =
		"relative flex justify-center items-center rounded-full  bg-[#40A7E3]"
	const DEFAULT_VARIANT_IMAGE = "object-cover rounded-full w-full h-full"

	const VARIANT_BUTTON = variant
		? ChangePhotoNS.variants[variant].button
		: ChangePhotoNS.variants.default.button

	const VARIANT_IMAGE = variant
		? ChangePhotoNS.variants[variant].image
		: ChangePhotoNS.variants.default.image

	const IMAGE_WIDTH = variant
		? ChangePhotoNS.variants[variant].image.width
		: ChangePhotoNS.variants.default.image.width

	const IMAGE_HEIGHT = variant
		? ChangePhotoNS.variants[variant].image.height
		: ChangePhotoNS.variants.default.image.height

	const IMAGE_ALT = variant
		? ChangePhotoNS.variants[variant].image.alt
		: ChangePhotoNS.variants.default.image.alt

	const DEFAULT_IMAGE_ALT = variant
		? ChangePhotoNS.variants[variant].defaultImage
		: ChangePhotoNS.variants.default.defaultImage

	return {
		WRAPPER,
		DEFAULT_VARIANT_BUTTON,
		DEFAULT_VARIANT_IMAGE,
		VARIANT_BUTTON,
		VARIANT_IMAGE,
		IMAGE_WIDTH,
		IMAGE_HEIGHT,
		IMAGE_ALT,
		DEFAULT_IMAGE_ALT,
	}
}
