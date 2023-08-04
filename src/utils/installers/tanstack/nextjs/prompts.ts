import { TBonitaConfigSchema, saveConfig } from "@/utils/config/config";
import { input,confirm } from "@inquirer/prompts";
import { TNextjsReactConfigSchema } from "./next";


export async function promptForNextjsConfig(config: TBonitaConfigSchema) {
  try {
    if (config && config.next_config) {
      return {
        ...config,
        next_config:config.next_config,
      };
    }
    const answers: TNextjsReactConfigSchema = {
      src_dir:await confirm({
        message: "Use src directory?",
        default:true,        
      })
    };
    const new_config = {
      ...config,
      next_config:answers,
    };
    saveConfig(new_config);
    return new_config;
  } catch (error: any) {
    throw new Error("error prompting for panda config " + error.message);
  }
}
