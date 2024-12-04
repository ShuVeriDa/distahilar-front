import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	webpack: config => {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		})
		return config
	},
	sassOptions: {
		silenceDeprecations: ["legacy-js-api"],
	},
	images: {
		remotePatterns: [
			{
				hostname: "avatars.githubusercontent.com",
			},
			{
				hostname: "res.cloudinary.com",
			},
		],
	},
}

export default nextConfig
