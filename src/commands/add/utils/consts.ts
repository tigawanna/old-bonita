export const addable_packages = ["tailwindcss","pandacss"] as const


export const tailwind_base_css = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`
export const tw_vite_react_content = [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
]
export const react_vite_tailwind_config_template = `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
