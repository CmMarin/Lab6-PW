/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg-color)',
        text: 'var(--text-color)',
        card: 'var(--card-bg)',
        accent: 'var(--accent)',
      },
      fontFamily: {
        sans: ['var(--font-stack)', 'sans-serif'],
        serif: ['var(--font-stack)', 'serif']
      }
    },
  },
  plugins: [],
}