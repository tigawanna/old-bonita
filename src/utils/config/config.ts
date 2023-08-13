import { string,select } from 'prask';
import { existsSync, readFileSync } from "fs";
import { z } from "zod";
import { tailwindSchema } from "../installers/tailwind/tailwind";
import { pandaSchema } from "../installers/panda/panda";
import {
  supportedFrameworks,
  checkFramework,
} from "../helpers/framework/whatFramework";
import { loader } from "../helpers/loader-tools";
import { frameworkDefaults } from "../helpers/framework/framework";
import { writeFile } from "fs/promises";
import { printHelpers } from "../helpers/print-tools";
import { tanstackViteReactSchema } from "../installers/tanstack/vite/vite-spa";
import { removeDirectory } from "../helpers/fs/directories";
import { nextjsReactSchema } from "../installers/tanstack/nextjs/next";

// const frameworkEnums = ["React+Vite", "Nextjs"] as const;

export const bonitaConfigSchema = z.object({
  root_dir: z.string().default("./src"),
  root_styles: z.string().default("./src/index.css"),
  state: z.string().default("./src/state"),
  components: z.string().default("./src/components"),
  framework: z.enum(supportedFrameworks),
  tailwind: tailwindSchema.optional(),
  panda: pandaSchema.optional(),
  vite_tanstack: tanstackViteReactSchema.optional(),
  next_config:nextjsReactSchema.optional(),
});

export type TBonitaConfigSchema = z.infer<typeof bonitaConfigSchema>;

export async function getBonitaConfig() {
  try {
    if (existsSync("./bonita.config.json")) {
      const bonita_config_file = JSON.parse(
        readFileSync("./bonita.config.json").toString(),
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
    printHelpers.warning("corrupt bonita config attempting to reset");
    await removeDirectory("./bonita.config.json");
    printHelpers.error("error getting bonita config , try again");
    process.exit(1);
  }
}

export async function promptForConfig() {
  try {
    const framework_type = await checkFramework();
    const { root_dir, root_styles, state, components } =
      frameworkDefaults(framework_type);
    const answers: TBonitaConfigSchema = {
      root_dir: await string({ message: "root directory ?", initial: root_dir }) ?? root_dir,
      root_styles: await string({message: "Main css file ?",initial: root_styles,}) ?? root_styles,
      framework:
        framework_type ??
        (await select({
          message: "Framework ?",
          options: [
            { value: "React+Vite", title: "React+Vite" },
            { value: "Nextjs", title: "Nextjs" },
          ],
        })),
      state: await string({ message: "state directory ?", initial: state }) ?? state,
      components: await string({message: "components directory ?",initial: components})?? components,
    };

    saveConfig(answers);
    return answers;
  } catch (error: any) {
    throw new Error("error prompting for config" + error.message);
  }
}

export async function saveConfig(config: TBonitaConfigSchema) {
  const save_config_loader = await loader("saving config");
  writeFile("./bonita.config.json", JSON.stringify(config, null, 2)).catch(
    (err) => {
      printHelpers.error("error saving config ", err.message);
      printHelpers.warning("Bonita config :", config);
      save_config_loader.failed();
    },
  );

  save_config_loader.succeed();
}
