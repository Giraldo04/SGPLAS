// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        negro: '#000000',    // Color negro
        blanco: '#FFFFFF',   // Color blanco
        beige: '#F5F5DC',   // Beige
      },
      fontFamily: {
        sans: ['"Poppins"', 'sans-serif'], // Ejemplo con Google Fonts (Poppins)
      },
    },
  },
  plugins: [],
}
