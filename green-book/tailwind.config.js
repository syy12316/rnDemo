/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        myGreen:"#98D98E",
        myGray:"#D3D3D3",
        myWhite:"#FEFEFE",
        myBackGround:"#F5F5F5",
      }
    },
  },
  plugins: [],
}