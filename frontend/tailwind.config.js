/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      fontWeight: {
        light: 300, // Custom font weight for light
        regular: 400, // Default regular font weight
        medium: 500, // Medium weight
        bold: 700, // Bold weight
      },
      colors: {
        gray700: "#374151",
        gray900: "#111827",
        zinc800: "#27272a",
        slate700: "#334155",
        slate900: "#0f172a",
        border: "#e0e0e0",
      },
    },
  },
  plugins: [],
};
