/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,html}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e01a4c',
        'background-light': '#f8f6f6',
        'background-dark': '#211115',
        'rose-accent': '#fb7185',
        'violet-accent': '#a78bfa',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        heading: ['Sora', 'sans-serif'],
        body: ['Nunito Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
