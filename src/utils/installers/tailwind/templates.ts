export const addable_packages = ["tailwindcss", "pandacss"] as const;

export const tailwind_base_css = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

export const tailwind_config_template = `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
     "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
    
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

export const postcss_templlate=`
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`

export const tw_deps = {
  "@pandacss/dev": "^0.11.0",
  "autoprefixer": "^10.4.14",
  "daisyui": "^3.5.0",
  "postcss": "^8.4.27",
  "tailwind-scrollbar": "^3.0.4",
  "tailwindcss": "^3.3.3",
  "tailwindcss-animate": "^1.0.6",
  "tailwindcss-elevation": "^2.0.0",
}

export function twPluginsTostring(plugins: string[]) {
  const tw_plugins = plugins.map((plugin) => {
    return `require("${plugin}")`;
  });
  return tw_plugins;
}

export function updateTwPlugins(plugins: string[]) {
  const configWithPlugins = tailwind_config_template.replace(
    /plugins: \[\]/,
    `plugins: [${twPluginsTostring(plugins)}]`,
  );
  return configWithPlugins;
}


