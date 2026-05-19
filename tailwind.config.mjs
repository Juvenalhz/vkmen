/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        vk: {
          black: '#000000', // [cite: 5]
          gray: '#738892',  // [cite: 19]
          light: '#d0e4e4', // [cite: 20]
        }
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'], // 
        body: ['"Avenir Light"', 'sans-serif'],  // 
      }
    },
  },
  plugins: [],
}