import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src//*.{js,jsx,ts,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./entities/**/*.{js,ts,jsx,tsx,mdx}",
		"./features/**/*.{js,ts,jsx,tsx,mdx}",
		"./shared/**/*.{js,ts,jsx,tsx,mdx}",
		"./widgets/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			keyframes: {
				"toast-in": {
					"0%": { opacity: "0", transform: "scale(0.95)" },
					"100%": { opacity: "1", transform: "scale(1)" },
				},
				"toast-out": {
					"0%": { opacity: "1", transform: "scale(1)" },
					"100%": { opacity: "0", transform: "scale(0.95)" },
				},
			},
			animation: {
				"toast-in": "toast-in 300ms ease-out forwards",
				"toast-out": "toast-out 300ms ease-in forwards",
			},
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			boxShadow: {
				"inner-top-bottom":
					"inset 0 5px 5px -5px rgba(0, 0, 0, 0.2), inset 0 -5px 5px -5px rgba(0, 0, 0, 0.2)",
			},
		},
	},
	plugins: [tailwindcssAnimate],
}
export default config
