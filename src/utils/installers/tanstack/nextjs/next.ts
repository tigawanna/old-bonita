import { TBonitaConfigSchema } from "@/utils/config/config";
import { z } from "zod";
import { promptForNextjsConfig } from "./prompts";
import { fetchNextjsTanstackTemplates, updateNextJsfilesWithTemplates, updateNextjsPkgJson } from "./remote-templates";
import { safeJSONParse } from "@/utils/helpers/json/json";
import { readFile, writeFile } from "fs/promises";
import { IPackageJson } from "@/utils/helpers/types";
import { merge } from "remeda";
import Spinnies from "spinnies";

export const nextjsReactSchema = z.object({
    src_dir: z.boolean().default(true),
});

export type TNextjsReactConfigSchema = z.infer<typeof nextjsReactSchema>;

export async function addNextjsTanstack(bonita_config: TBonitaConfigSchema,) {
    try {
    //  install dependancies

    const templates = await fetchNextjsTanstackTemplates();
    // if(templates["package.json"]){
    //     await updateNextjsPkgJson(templates)
    // }
    await updateNextJsfilesWithTemplates(templates, bonita_config); 

    } catch (error: any) {
        process.exit(1);
    }
}
