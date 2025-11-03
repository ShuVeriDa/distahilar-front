import type { NextConfig } from "next"

import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
	// Enable React strict mode for production
	reactStrictMode: true,

	// Production optimizations
	poweredByHeader: false, // Remove X-Powered-By header
	compress: true, // Enable gzip compression

	// Standalone output for Docker
	output: "standalone",

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
			{
				hostname: "cdn.jsdelivr.net",
			},
		],
	},
}

export default withNextIntl(nextConfig)
