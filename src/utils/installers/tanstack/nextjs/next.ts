import { TBonitaConfigSchema } from "@/utils/config/config";
import { z } from "zod";
import {
  fetchNextjsTanstackTemplates,
  updateNextJsfilesWithTemplates,
} from "./remote-templates";
import { boolean } from "prask";
import { getPkgJson, filterAndIncludeDeps } from "@/utils/helpers/pkg-json";
import { writeFile } from "fs/promises";
import { merge } from "remeda";
import Spinnies from "spinnies";
import { TPageOptions } from "@/commands/page/args";

export const nextjsReactSchema = z.object({
  src_dir: z.boolean().default(true),
});

export type TNextjsReactConfigSchema = z.infer<typeof nextjsReactSchema>;

export async function addNextjsTanstack(bonita_config: TBonitaConfigSchema,options?:TPageOptions) {
  try {
    if(!options?.yes){
    const consent = await boolean({
      message:
        "This will overwrite sapp/page.tsx and app/layout.tsx. Do you want to continue?",
      initial: true,
    });
    // @ts-expect-error
      if (!!consent[0]) {
      // process.exit(1);
      return
    }
  }
    const templates = await fetchNextjsTanstackTemplates();
    await updateNextJsfilesWithTemplates(templates, bonita_config);
    await addtanstackNextDeps();

  } catch (error: any) {
    // process.exit(1);
    throw error
  }
}


export async function addtanstackNextDeps() {
  const spinnies = new Spinnies();
  try {
    spinnies.add("fetching", { text: "adding tanstack deps" });
    const pkg_json = await getPkgJson();
    const tan_deps_json = await filterAndIncludeDeps("tanstack",{
      "tanstack":{
        dev:{
          "@tanstack/eslint-plugin-query":"latest",
          "@tanstack/react-query-devtools":"latest"
        },
        main:{
          "@tanstack/react-query":"latets"
        }
      }
    })
   
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
