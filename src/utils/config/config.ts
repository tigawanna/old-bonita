import { input, select, checkbox } from "@inquirer/prompts";
import { existsSync, readFileSync } from "fs";
import {
  checkFramework,
  tryCatchWrapper,
  writeFileAsync,
  loader,
  print,
  supportedFrameworks,
} from "gluegun-toolbox";
import { z } from "zod";
import { validStr } from "../helpers/general";
import { frameworkDefaults } from "../helpers/framework";
import { tailwindSchema } from "../installers/tailwind/tailwind";
import { pandaSchema } from "../installers/panda/panda";

// const frameworkEnums = ["React+Vite", "Nextjs"] as const;

const bonitaConfigSchema = z.object({
  root_dir: z.string().default("./src"),
  root_styles: z.string().default("./src/index.css"),
  framework: z.enum(supportedFrameworks),
  tailwind: tailwindSchema.optional(),
  panda: pandaSchema.optional(),
});

export type TBonitaConfigSchema = z.infer<typeof bonitaConfigSchema>;

export async function getBonitaConfig() {
  try {
    if (existsSync("./bonita.config.json")) {
      const bonita_config_file = JSON.parse(
        readFileSync("./bonita.config.json").toString()
      );
      const bonita_config = bonitaConfigSchema.parse(bonita_config_file);
      if (bonita_config) {
        return bonita_config;
      } else {
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
    const framework_type = await checkFramework();
    const { root_dir, root_styles } = frameworkDefaults(framework_type);
    const answers: TBonitaConfigSchema = {
      root_dir: await input({ message: "root directory ?", default: root_dir }),
      root_styles: await input({
        message: "Main css file ?",
        default: root_styles,
      }),
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

export async function saveConfig(config: TBonitaConfigSchema) {
  const save_config_loader = await loader("saving config");
  const [res, err] = tryCatchWrapper(async () => {
    await writeFileAsync("./bonita.config.json", JSON.stringify(config));
  });
  if (err) {
    print.error("error saving config " + err.message);
    print.warning(config);
    save_config_loader.failed();
  }
  save_config_loader.succeed();
}
