import { TBonitaConfigSchema, saveConfig } from "@/utils/config/config";
import { input,checkbox } from "@inquirer/prompts";
import { TTailwindConfigSchema } from "./tailwind";

type NonNullableTailwindBonitaConfigSchema = Required<TBonitaConfigSchema>;
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
      tw_config: await input({
        message: "Where do you want to add your tailwind config file",
        default: "tailwind.config.js",
      }),
      tw_plugins: await checkbox({
        message: "Want some plugins?",
        choices: [
          { value: "daisyui", name: "daisyui" },
          { value: "tailwindcss-animate", name: "tailwindcss-animate" },
          { value: "tailwind-scrollbar", name: "tailwind-scrollbar" },
          { value: "tailwindcss-elevation", name: "tailwindcss-elevation" },
        ],
      }),
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
