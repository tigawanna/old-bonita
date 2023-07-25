import { input, select, checkbox } from "@inquirer/prompts";
import { existsSync, readFileSync } from "fs";
import { checkFramework, tryCatchWrapper, writeFileAsync, loader, print } from "gluegun-toolbox";

import { z } from "zod";
import { validStr } from "./helpers";
import { writeFile } from "fs/promises";
const frameworkEnums = ["React+Vite", "Nextjs"] as const;

const bonitaConfigSchema = z.object({
  root_dir: z.string().default("./src"),
  root_styles: z.string().default("./src/index.css"),
  framework: z.enum(frameworkEnums),
  tailwind: z
    .object({
      tw_config: z.string().default("tailwind.config.js"),
      tw_plugins: z.array(z.string()).default([]),
    })
    .optional(),
});

export type TBonitaConfigSchema = z.infer<typeof bonitaConfigSchema>;

export async function getBonitaConfig() {
 try {
    if (existsSync("./bonita.config.json")) {
      const bonita_config_file = JSON.parse(readFileSync("./bonita.config.json").toString());
      const bonita_config = bonitaConfigSchema.parse(bonita_config_file);
      if(bonita_config.tailwind){
        return bonita_config;
      }
      else{
        return await promptForConfig();
      }
    } else {
      return await promptForConfig();
    }
  } catch (error) {
    throw error;
  }

}

export async function promptForConfig() {
  try {
    const framework_type = (await checkFramework()) as unknown as (typeof frameworkEnums)[0];
    print.info("Prompting for config...");
    const answers: TBonitaConfigSchema = {
      root_dir: await input({ message: "root directory ?", default: "./src"}),
      root_styles: await input({ message: "Main css file ?", default: "./src/index.css"}),
      framework:
        framework_type ??
        (await select({
          message: "Framework ?",
          choices: [
            { value: "React+Vite", name: "React+Vite" },
            { value: "Nextjs", name: "Nextjs" },
          ],
        })),
    };

    saveConfig(answers);
    return answers;
  } catch (error: any) {
    throw new Error("error prompting for config" + error.message);
  }
}
export async function promptForTWConfig(config: TBonitaConfigSchema) {
  try {
    const framework_type = (await checkFramework()) as unknown as (typeof frameworkEnums)[0];
    print.info("Prompting for tailwind config...");
    const answers: TBonitaConfigSchema = {
      root_dir: validStr(config.root_dir) ?? (await input({ message: "root directory ?",default: "./src"})),
      root_styles: validStr(config.root_styles) ?? (await input({ message: "Main css file ?",default: "./src/index.css"})),
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
    };
    if(!answers.tailwind){
      throw new Error("tailwind config missing");
    }
    saveConfig(answers);
    return answers;

  } catch (error: any) {
    throw new Error("error prompting for tailwind config " + error.message);
  }
}

export async function saveConfig(config: TBonitaConfigSchema) {
  const save_config_loader = await loader("saving config");
  const [res, err] = tryCatchWrapper(async () => {
    await writeFileAsync("./bonita.config.json", JSON.stringify(config));
  });
  if (err) {
    print.error("error saving config "+err.message);
    print.warning(config);
    save_config_loader.failed();
  }
  save_config_loader.succeed();
}
