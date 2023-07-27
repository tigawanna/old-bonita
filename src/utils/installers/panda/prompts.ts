import { TBonitaConfigSchema, saveConfig } from "@/utils/config/config";
import { frameworkDefaults } from "@/utils/helpers/framework";
import { validStr } from "@/utils/helpers/general";
import { input, select, checkbox } from "@inquirer/prompts";
import { checkFramework } from "gluegun-toolbox";

type NonNullableTailwindBonitaConfigSchema = Required<TBonitaConfigSchema>;
export async function promptForPandaConfig(config: TBonitaConfigSchema) {
    try {
        if (config && config.tailwind && "tw_config" in config.tailwind) {
            return {
                ...config, tailwind: {
                    tw_config: config.tailwind.tw_config ?? "tailwind.config.js",
                    tw_plugins: config.tailwind.tw_plugins ?? []
                }
            };
        }
        const framework_type = await checkFramework();
        const { root_dir, root_styles, tailwind } = frameworkDefaults(framework_type);
        const answers = {
            root_dir: validStr(config.root_dir) ?? (await input({ message: "root directory ?", default: root_dir })),
            root_styles: validStr(config.root_styles) ?? (await input({ message: "Main css file ?", default: root_styles })),
            framework:
                framework_type ??
                (await select({
                    message: "Framework ?",
                    choices: [
                        { value: "React+Vite", name: "React+Vite" },
                        { value: "Nextjs", name: "Nextjs" },
                    ],
                })),

            tailwind: {
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
            },
        } satisfies NonNullableTailwindBonitaConfigSchema;

        saveConfig(answers);
        return answers;

    } catch (error: any) {
        throw new Error("error prompting for tailwind config " + error.message);
    }
}
