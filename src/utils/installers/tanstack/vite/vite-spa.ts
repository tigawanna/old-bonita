import { TBonitaConfigSchema } from "@/utils/config/config";
import { z } from "zod";
import { promptForTanstackConfig } from "./prompts";
import { setUpRouterTemplate } from "../helpers";
import { addViteTSPathAlias } from "@/utils/helpers/config/vite";
import { removeDirectory } from "@/utils/helpers/fs/directories";
import Spinnies from "spinnies";
import { installPackages} from "@/utils/helpers/package-managers";

// Define the tailwind schema
export const tanstackViteReactSchema = z.object({
  src_root_path: z.string().default("./src/main.tsx"),
  src_app_path: z.string().default("./src/App.tsx"),
  pages_dir_path: z.string().default("./src/pages"),
  routes_path: z.string().default("./src/pages/routes/routes.ts"),
});

export type TTanstckViteReactConfigSchema = z.infer<
  typeof tanstackViteReactSchema
>;

export async function addTanstackToVite(bonita_config: TBonitaConfigSchema,) {
  try {
    //  install dependancies
    const config = await promptForTanstackConfig(bonita_config);
    await setUpRouterTemplate(config);
    await addViteTSPathAlias();
    await removeDirectory("./temp");
    await installPackages([""]);
  } catch (error: any) {
    process.exit(1);
  }
}
