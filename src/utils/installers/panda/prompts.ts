import { TBonitaConfigSchema, saveConfig } from "@/utils/config/config";
import { input } from "@inquirer/prompts";
import { TPandaConfigSchema } from "./panda";

export async function promptForPandaConfig(config: TBonitaConfigSchema) {
  try {
    if (config && config.panda && "panda_config_path" in config.panda) {
      return {
        ...config,
        panda: {
          panda_config_path: config.panda.panda_config_path,
        },
      };
    }

    const answers: TPandaConfigSchema = {
      panda_config_path: await input({
        message: "Where do you want to add your panda config file",
        default: "panda.config.ts",
      }),
    };
    const new_config = {
      ...config,
      panda: answers,
    };
    saveConfig(new_config);
    return new_config;
  } catch (error: any) {
    throw new Error("error prompting for panda config " + error.message);
  }
}
