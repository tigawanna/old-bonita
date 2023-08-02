import { TBonitaConfigSchema, saveConfig } from "@/utils/config/config";
import { input } from "@inquirer/prompts";
import { TTanstckViteReactConfigSchema } from "./router/router";


export async function promptForTanstackConfig(config: TBonitaConfigSchema) {
  try {
    if (config && config.vite_tanstack) {
      return {
        ...config,
        vite_tanstack: config.vite_tanstack,
      };
    }
     const answers: TTanstckViteReactConfigSchema = {
      src_root_path: await input({
        message: "Where is your main.tsx",
        default: "./src/main.tsx",
      }),
      src_app_path: await input({
        message: "Where is youor App.tsx",
        default: "./src/App.tsx",
      }),
      pages_dir_path: await input({
        message: "Where is your pages directory",
        default: "./src/pages",
      }),
      routes_path: await input({
        message: "Where do you want to put your routes",
        default: "./src/pages/routes/routes.ts",
      }),
    };
    const new_config = {
      ...config,
      vite_tanstack:answers,
    };
    saveConfig(new_config);
    return new_config;
  } catch (error: any) {
    throw new Error("error prompting for panda config " + error.message);
  }
}
