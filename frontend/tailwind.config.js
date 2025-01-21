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
          surface: {
            DEFAULT: "#1A1B1E", // Main background - matte black
            secondary: "#2A2B2F", // Secondary surfaces - slightly lighter
            card: "#212226", // Card background
          },
          primary: {
            DEFAULT: "#0A84FF", // Main blue - iOS style
            light: "#3396FF", // Lighter blue for hover states
            dark: "#0066CC", // Darker blue for active states
          },
          text: {
            DEFAULT: "#FFFFFF", // Primary text
            secondary: "#A0A0A0", // Secondary text
            light: "#6B6B6B", // Disabled/subtle text
          },
          border: {
            DEFAULT: "#2F3033", // Default borders
            light: "#363940", // Lighter borders
          },
          // Optional accent colors if needed
          accent: {
            success: "#39FF14", // Green for positive values
            error: "#FF073A", // Red for negative values
          },
        },
      },
    },
  },
  plugins: [],
};
