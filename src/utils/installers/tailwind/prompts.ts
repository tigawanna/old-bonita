import { TBonitaConfigSchema, saveConfig } from "@/utils/config/config";
import { TTailwindConfigSchema } from "./tailwind";
import { string, multiselect } from "prask";
import { existsSync } from "fs";


export async function promptForTWConfig(config: TBonitaConfigSchema) {
  try {
    if (config && config.tailwind && "tw_config" in config.tailwind) {
      return {
        ...config,
        tailwind: {
          tw_config: config.tailwind.tw_config ?? "tailwind.config.js",
          tw_plugins: config.tailwind.tw_plugins ?? [],
        },
      };
    }
    const answers: TTailwindConfigSchema = {
      tw_config:
        (await string({
          message: "Where do you want to add your tailwind config file",
          initial: existsSync("tailwind.config.ts")?"tailwind.config.ts":"tailwind.config.js",
        })) ?? "tailwind.config.js",
      tw_plugins: (await multiselect({
        message: "Want some plugins?",
        options: [
          { value: "daisyui", title: "daisyui" },
          { value: "tailwindcss-animate", title: "tailwindcss-animate" },
          { value: "tailwind-scrollbar", title: "tailwind-scrollbar" },
          { value: "tailwindcss-elevation", title: "tailwindcss-elevation" },
        ],
      })) ?? [""],
    };

    const new_config = {
      ...config,
      tailwind: answers,
    };

    saveConfig(new_config);
    return new_config;
  } catch (error: any) {
    throw new Error("error prompting for tailwind config " + error.message);
  }
}
