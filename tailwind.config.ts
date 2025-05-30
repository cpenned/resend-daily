import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: "hsl(var(--card))",
				"card-foreground": "hsl(var(--card-foreground))",
				popover: "hsl(var(--popover))",
				"popover-foreground": "hsl(var(--popover-foreground))",
				primary: "hsl(var(--primary))",
				"primary-foreground": "hsl(var(--primary-foreground))",
				secondary: "hsl(var(--secondary))",
				"secondary-foreground": "hsl(var(--secondary-foreground))",
				muted: "hsl(var(--muted))",
				"muted-foreground": "hsl(var(--muted-foreground))",
				accent: "hsl(var(--accent))",
				"accent-foreground": "hsl(var(--accent-foreground))",
				destructive: "hsl(var(--destructive))",
				"destructive-foreground": "hsl(var(--destructive-foreground))",
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				"chart-1": "hsl(var(--chart-1))",
				"chart-2": "hsl(var(--chart-2))",
				"chart-3": "hsl(var(--chart-3))",
				"chart-4": "hsl(var(--chart-4))",
				"chart-5": "hsl(var(--chart-5))",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			animation: {
				pulseScale: "pulseScale 15s ease-in-out infinite",
				down: "down 1s ease-in-out forwards",
			},
			keyframes: {
				pulseScale: {
					"0%, 100%": { transform: "scale(1)" },
					"50%": { transform: "scale(1.15)" },
				},
				down: {
					"0%": { transform: "translateY(0) rotate(0deg)" },
					"100%": {
						transform: "translateY(22px) translateX(3px) rotate(-8deg)",
					},
				},
			},
		},
	},
	plugins: [],
} satisfies Config;
