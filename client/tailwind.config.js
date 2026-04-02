/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e293b",
        accent: "#3b82f6",
      },
      boxShadow: {
        'lg': '0 10px 30px rgba(0, 0, 0, 0.3)',
        '2xl': '0 20px 50px rgba(0, 0, 0, 0.3)',
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
