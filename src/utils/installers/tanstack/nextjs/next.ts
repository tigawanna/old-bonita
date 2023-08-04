import { TBonitaConfigSchema } from "@/utils/config/config";
import { z } from "zod";
import { promptForNextjsConfig } from "./prompts";
import { fetchNextjsTanstackTemplates, updateNextJsfilesWithTemplates, updateNextjsPkgJson } from "./remote-templates";
import { safeJSONParse } from "@/utils/helpers/json/json";
import { readFile, writeFile } from "fs/promises";
import { IPackageJson } from "@/utils/helpers/types";
import { merge } from "remeda";
import Spinnies from "spinnies";
import { confirm } from "@inquirer/prompts";

export const nextjsReactSchema = z.object({
    src_dir: z.boolean().default(true),
});

export type TNextjsReactConfigSchema = z.infer<typeof nextjsReactSchema>;

export async function addNextjsTanstack(bonita_config: TBonitaConfigSchema,) {
    try {
    const consent = await confirm({
        message:"This will overwrite sapp/page.tsx and app/layout.tsx. Do you want to continue?",
        default: true,
    });
    if (!consent) {
        process.exit(1);
    }
    const templates = await fetchNextjsTanstackTemplates();
    await updateNextJsfilesWithTemplates(templates, bonita_config); 

    } catch (error: any) {
        process.exit(1);
    }
}
