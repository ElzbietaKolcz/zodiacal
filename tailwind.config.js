/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./componets/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "hsl(250, 85%, 5%)",
        while: "hsl(20, 100%m 99%)",

        primary: {
          100: "hsl(290, 65%, 40%)",
        },
      },
    },
  },
  plugins: [],
};
