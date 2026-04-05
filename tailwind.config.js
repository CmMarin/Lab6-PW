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
        'accent-dark': 'var(--accent-dark)',
        border: 'var(--border-color)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'cursive', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        sans: ['Space Grotesk', 'sans-serif'] // For generic reading if needed, but not standard Inter!
      },
      boxShadow: {
        brutal: '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-active': '1px 1px 0px 0px rgba(0,0,0,1)',
        glow: '0 0 15px var(--accent), 0 0 30px var(--accent)',
        'glow-lg': '0 0 20px var(--accent), 0 0 40px var(--accent)',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      }
    },
  },
  plugins: [],
}