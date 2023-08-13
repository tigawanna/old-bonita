import { safeJSONParse } from "@/utils/helpers/json/json";
import { printHelpers } from "@/utils/helpers/print-tools";
import { IPackageJson } from "@/utils/helpers/types";
import Spinnies from "spinnies";

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
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./web/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

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

export async function getPkgJsonTailwindDeps() {
  const spinnie = new Spinnies();
  spinnie.add("fetching", { text: "checking latest tailwind versions" });
  const url = `https://github.com/tailwindlabs/tailwindcss.com/raw/master/package.json`;
  const headers = {
    Accept: "application/json",
  };
  return fetch(url, { headers })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.text();
    })
    .then((data) => {
      spinnie.succeed("fetching");
      const pkg_json = safeJSONParse<IPackageJson>(data);
      return pkg_json;
    })
    .catch((error) => {
      spinnie.fail("fetching", { text: error.message });
      printHelpers.error(error);
      throw error;
    });
}
