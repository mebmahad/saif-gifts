// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Ensure this is correct
  theme: {
    extend: {
      colors: {
        "gift-primary": "#6D28D9", // Verify HEX code
        "gift-secondary": "#DB2777",
      },
    },
  },
  plugins: [],
};