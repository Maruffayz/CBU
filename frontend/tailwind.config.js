/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#f0f4ff', 100:'#e0e9ff', 500:'#4f6ef7', 600:'#3a57e8', 700:'#2b44cc' },
        surface: { DEFAULT:'#0f1117', card:'#161b27', border:'#1e2535' }
      },
      fontFamily: { sans: ['var(--font-inter)'] }
    }
  },
  plugins: []
}
