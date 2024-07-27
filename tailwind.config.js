/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'regal-blue': '#0f0d54',
      },
      scrollbar: {
        hide: {
          'scrollbar-width': 'none',  /* Firefox */
          '-ms-overflow-style': 'none',  /* IE and Edge */
          '&::-webkit-scrollbar': {
            display: 'none',  /* Chrome, Safari and Opera */
          },
        },
      },
    },
  },
  plugins: [],
}

