/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#EC4899',
          light: '#F472B6',
          dark: '#DB2777'
        },
        background: '#FFF7FB',
        surface: '#FFFFFF',
        text: {
          DEFAULT: '#1F2937',
          muted: '#6B7280'
        },
        border: '#FBCFE8'
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(236, 72, 153, 0.1), 0 2px 4px -1px rgba(236, 72, 153, 0.06)',
      },
      borderRadius: {
        'xl': '16px',
      }
    },
  },
  plugins: [],
}
