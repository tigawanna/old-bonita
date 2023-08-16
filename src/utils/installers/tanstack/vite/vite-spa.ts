import { TBonitaConfigSchema } from "@/utils/config/config";
import { z } from "zod";
import { promptForTanstackConfig } from "../../../config/prompts/vite-tanstack";
import { setUpRouterTemplate } from "../helpers";
import { addViteTSPathAlias } from "@/utils/helpers/config/vite";
import { removeDirectory } from "@/utils/helpers/fs/directories";
import { boolean } from "prask";
import { getDepsJson, getPkgJson } from "@/utils/helpers/pkg-json";
import { merge } from "remeda";
import Spinnies from "spinnies";
import { writeFile } from "fs/promises";

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
    //  install dependencies
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
    await addTanstackViteReactDeps()

   
  } catch (error: any) {
    // process.exit(1);
    throw error
  }
}


export async function addTanstackViteReactDeps() {
  const spinnies = new Spinnies();
  try {
    spinnies.add("fetching", { text: "adding tanstack deps" });
    const pkg_json = await getPkgJson();
    const tan_deps_json = (await getDepsJson()).tanstack
    const new_deps = merge(pkg_json.dependencies, tan_deps_json.main)
    const new_dev_deps = merge(pkg_json.devDependencies, tan_deps_json.dev)
    pkg_json.dependencies = new_deps;
    pkg_json.devDependencies = new_dev_deps

    await writeFile("./package.json", JSON.stringify(pkg_json, null, 2), "utf8");
    spinnies.succeed("fetching");
  } catch (error) {
    throw error;
  }
}
