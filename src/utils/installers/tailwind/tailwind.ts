import { TBonitaConfigSchema } from "@/utils/config/config";
import { addBaseTWcss, addTailwindDeps, tailwindInit } from "@/utils/installers/tailwind/config_tw";
import { validateRelativePath } from "@/utils/helpers/strings/general";
import { promptForTWConfig } from "./prompts";
import { z } from "zod";
import { printHelpers } from "@/utils/helpers/print-tools";


// Define the tailwind schema
export const tailwindSchema = z.object({
  tw_config: z.string().default("tailwind.config.js"),
  tw_plugins: z.array(z.string()).default([]),
});

export type TTailwindConfigSchema = z.infer<typeof tailwindSchema>;


export async function installTailwind(bonita_config: TBonitaConfigSchema) {
  try {
    const config = await promptForTWConfig(bonita_config);
    const root_styles = validateRelativePath(config.root_styles);
    await addBaseTWcss(root_styles)
    await tailwindInit(bonita_config)
    await addTailwindDeps()
 
    } catch (error: any) {
    // tailwind_spinners.fail("main");
    printHelpers.error("Error installing Tailwind  :\n" + error.message);
   // process.exit(1);
  }
}
