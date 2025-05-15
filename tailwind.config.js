/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
	  extend: {
		colors: {
		  primary: {
			50: '#f0f9ff',
			100: '#e0f2fe',
			200: '#bae6fd',
			300: '#7dd3fc',
			400: '#38bdf8',
			500: '#0ea5e9',
			600: '#0284c7',
			700: '#0369a1',
			800: '#075985',
			900: '#0c4a6e',
			950: '#082f49',
		  },
		},
	  },
	},
	plugins: [],
	safelist: [
	  // Dodajemy często używane klasy, aby upewnić się, że zostaną uwzględnione w pliku CSS
	  'bg-primary-600',
	  'hover:bg-primary-700',
	  'text-white',
	  'focus:ring-primary-500',
	  'bg-red-50',
	  'text-red-700',
	  'bg-blue-600',
	  'hover:bg-blue-700',
	  'focus:ring-blue-500',
	  'bg-gray-50',
	  'bg-white',
	]
  }