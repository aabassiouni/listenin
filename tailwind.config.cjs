/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
const { blackA, mauve, violet} = require("@radix-ui/colors");

module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite/**/*.jsx"],
	theme: {
		colors: {
			transparent: "transparent",
			current: "currentColor",
			white: "#ffffff",
			palette: {
				100: "#16DB65",
				200: "#058C42",
				300: "#04471C",
				400: "#0D2818",
				500: "#020202",
			},
			...blackA,
			...mauve,
			...violet,
			

		},
		extend: {

			keyframes: {
				marquee: {
					"0%": { transform: "translateX(0%)" },
					"100%": { transform: "translateX(-100%)" },
				},
				marquee2: {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0%)" },
				},
				overlayShow: {
					from: { opacity: 0 },
					to: { opacity: 1 },
				},
				contentShow: {
					from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
					to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
				},
			},
			animation: {
				marquee: "marquee 25s linear infinite",
				marquee2: "marquee2 25s linear infinite",
				overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
				contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
			},
		},
	},

	plugins: [
		require("flowbite/plugin"),
		plugin(function ({ matchUtilities, theme }) {
			matchUtilities(
				{
					"text-shadow": (value) => ({
						textShadow: value,
					}),
				},
				{ values: theme("textShadow") }
			);
		}),
	],
};
