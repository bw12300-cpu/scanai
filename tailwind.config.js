/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0D11',
        surface: '#111318',
        surface2: '#171A21',
        border: '#232840',
        cyan: '#00E5C8',
        amber: '#F0A500',
        danger: '#F03E3E',
        success: '#2ECC71',
        info: '#3B9EFF',
      },
      fontFamily: {
        sans: ['IBM Plex Sans KR', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
