/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        first: {
          DEFAULT: "#005246",
          800: "#006E62",
          700: "#007E72",
          600: "#008F82",
          500: "#009C90",
          400: "#27ABA1",
          300: "#4FBBB2",
          200: "#82CEC9",
          100: "#B3E1DE",
          50: "#E1F3F2",
        },
        second: {
          900: "#FF790A",
          800: "#FF9712",
          700: "#FFA816",
          600: "#FFBB1A",
          500: "#FFC921",
          400: "#FFD136",
          DEFAULT: "#FFDB58",
          200: "#FFE488",
          100: "#FEEFB6",
          50: "#FFF9E2",
        },
        third: {
          DEFAULT: "#F78330",
          800: "#FDAA3B",
          700: "#FFC242",
          600: "#FFDA49",
          500: "#FFE546",
          400: "#FFEA60",
          300: "#FFEF7D",
          200: "#FFF4A1",
          100: "#FFF9C7",
          50: "#FFFDE8",
        },
      },
      fontFamily: {
        ibm: ["IBM Plex Sans KR"],
      },
      screens: {
        sm: { max: "480px" },
        md: { max: "768px" },
        lg: { max: "1280px" },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hidden": {
          "scrollbar-width": "none" /* Firefox */,
          "-ms-overflow-style": "none" /* Internet Explorer and Edge */,
        },
        ".scrollbar-hidden::-webkit-scrollbar": {
          display: "none" /* Safari and Chrome */,
        },
      });
    },
  ],
});
