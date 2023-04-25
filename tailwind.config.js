/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        hero: "url('/src/assets/img/home.png')",
      },
      fontFamily: {
        merriweather: ['Merriweather', 'serif'],
        merriweatherSans: ['Merriweather Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
