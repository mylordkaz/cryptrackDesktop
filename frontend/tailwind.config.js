/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light mode
        // Light mode colors
        surface: {
          DEFAULT: "#F7FBFC", // Main background - very light blue-gray
          secondary: "#EDF3F4", // Secondary surfaces - slightly darker
          card: "#FFFFFF", // Card/container background - pure white
        },
        primary: {
          DEFAULT: "#2B6CB0", // Main blue - balanced intensity
          light: "#4299E1", // Lighter blue for hover states
          dark: "#2C5282", // Darker blue for active states
        },
        text: {
          DEFAULT: "#2D3748", // Primary text - dark blue-gray
          secondary: "#4A5568", // Secondary text - medium blue-gray
          light: "#718096", // Lighter text for less emphasis
        },
        border: {
          DEFAULT: "#E2E8F0", // Default borders - light blue-gray
          light: "#EDF2F7", // Lighter borders for subtle separation
        },

        //Dark mode
        dark: {
          primary: "#3B82F6", // blue-500
          "primary-light": "#60A5FA", // blue-400
          surface: {
            DEFAULT: "#1E1E1E",
            secondary: "#2D2D2D",
          },
          text: {
            DEFAULT: "#F9FAFB", // gray-50
            secondary: "#9CA3AF", // gray-400
          },
        },
      },
    },
  },
  plugins: [],
};
