import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: '#0f1117', 1: '#161b27', 2: '#1e2435', 3: '#252d42' },
      }
    },
  },
  plugins: [],
}
export default config
