/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				magenta1: '#E23155',
				magenta2: '#C54B63',
				blue1: '#00adf1',
				blue2: '#0089d1',
				blue3: '#d0ecf7',
				green1: '#ADDCD4',
				green2: '#B1EDE2',
				green3: '#DDFFF9',
				gray1: '#EFEFEF',
				gray2: '#D9D9D9',
				gray3: '#A1A9B9',
				graphite: '#312E2E',
				red1: '#ed1b24',
				red2: '#d95353',
			},
			fontFamily: {
				montserrat: ['Montserrat', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
