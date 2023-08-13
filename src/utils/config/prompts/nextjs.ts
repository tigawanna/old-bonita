import { TBonitaConfigSchema, saveConfig } from "@/utils/config/config";
import { boolean } from "prask";
import { TNextjsReactConfigSchema } from "../../installers/tanstack/nextjs/next";

export async function promptForNextjsConfig(config: TBonitaConfigSchema) {
  try {
    if (config && config.next_config) {
      return {
        ...config,
        next_config: config.next_config,
      };
    }
    const answers: TNextjsReactConfigSchema = {
      src_dir:
        (await boolean({
          message: "Use src directory?",
          initial: true,
        })) ?? true,
    };
    const new_config = {
      ...config,
      next_config: answers,
    };
    saveConfig(new_config);
    return new_config;
  } catch (error: any) {
    throw new Error("error prompting for panda config " + error.message);
  }
}
