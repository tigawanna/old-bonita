import { TBonitaConfigSchema, saveConfig } from "@/utils/config/config";
import { TTanstckViteReactConfigSchema } from "../../installers/tanstack/vite/vite-spa";
import { string } from "prask";

export async function promptForTanstackConfig(config: TBonitaConfigSchema) {
  try {
    if (config && config.vite_tanstack) {
      return {
        ...config,
        vite_tanstack: config.vite_tanstack,
      };
    }
    const answers: TTanstckViteReactConfigSchema = {
      src_root_path:
        (await string({
          message: "Where is your main.tsx",
          initial: "./src/main.tsx",
        })) ?? "./src/main.tsx",
      src_app_path:
        (await string({
          message: "Where is youor App.tsx",
          initial: "./src/App.tsx",
        })) ?? "./src/App.tsx",
      pages_dir_path:
        (await string({
          message: "Where is your pages directory",
          initial: "./src/pages",
        })) ?? "./src/pages",
      routes_path:
        (await string({
          message: "Where do you want to put your routes",
          initial: "./src/pages/routes/routes.ts",
        })) ?? "./src/pages/routes/routes.ts",
    };
    const new_config = {
      ...config,
      vite_tanstack: answers,
    };
    saveConfig(new_config);
    return new_config;
  } catch (error: any) {
    throw new Error("error prompting for panda config " + error.message);
  }
}
