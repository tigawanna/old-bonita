import { TBonitaConfigSchema } from "@/utils/config/config";
import { z } from "zod";
;import { printHelpers } from "@/utils/helpers/print-tools";
import { promptForTanstackConfig } from "../prompts";
import { setUpRouterTemplate } from "../helpers";
import { addViteTSPathAlias } from "@/utils/helpers/framework/vite";

// Define the tailwind schema
export const tanstackViteReactSchema = z.object({
    src_root_path: z.string().default("./src/main.tsx"),
    src_app_path: z.string().default("./src/App.tsx"),
    pages_dir_path: z.string().default("./src/pages"),
    routes_path: z.string().default("./src/pages/routes/routes.ts"),
});

export type TTanstckViteReactConfigSchema = z.infer<typeof tanstackViteReactSchema>;

export async function installTanstackRouter(bonita_config: TBonitaConfigSchema) {
    try {
        //  install dependancies
    const config = await promptForTanstackConfig(bonita_config);
    const res = await setUpRouterTemplate(config);
    await addViteTSPathAlias();
    printHelpers.success("tanstack boilerpate setup succefully successfully",res);
     } catch (error: any) {
        printHelpers.error("Error adding tanstack  :\n" + error.message);
        process.exit(1);
    }
}
