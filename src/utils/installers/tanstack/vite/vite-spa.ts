import { TBonitaConfigSchema } from "@/utils/config/config";
import { z } from "zod";
import { promptForTanstackConfig } from "../../../config/prompts/vite-tanstack";
import { setUpRouterTemplate } from "../helpers";
import { addViteTSPathAlias } from "@/utils/helpers/config/vite";
import { removeDirectory } from "@/utils/helpers/fs/directories";
import { installPackages } from "@/utils/helpers/pkg-manager/package-managers";
import { boolean } from "prask";

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

export async function addTanstackToVite(bonita_config: TBonitaConfigSchema) {
  try {
    //  install dependancies
    const config = await promptForTanstackConfig(bonita_config);
    const consent = await boolean({
      message: `This will overwrite ${JSON.stringify(
        bonita_config.vite_tanstack,
      )} Do you want to continue?`,
      initial: true,
    });
    if (!consent) {
      process.exit(1);
    }
    await setUpRouterTemplate(config);
    await addViteTSPathAlias();
    await removeDirectory("./temp");
    await installPackages([""]);
  } catch (error: any) {
    process.exit(1);
  }
}
