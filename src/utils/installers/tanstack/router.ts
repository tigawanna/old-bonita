import { TBonitaConfigSchema } from "@/utils/config/config";
import { z } from "zod";
;import { printHelpers } from "@/utils/helpers/print-tools";
import { promptForTanstackConfig } from "./prompts";
import { installPackages } from "@/utils/helpers/package-managers";

// Define the tailwind schema
export const tanstackViteReactSchema = z.object({
    src_root_path: z.string().default("./src/main.tsx"),
    src_app_path: z.string().default("./src/App.tsx"),
    pages_dir_path: z.string().default("./src/pages")
});

export type TTanstckViteReactConfigSchema = z.infer<typeof tanstackViteReactSchema>;

export async function installTanstackRouter(bonita_config: TBonitaConfigSchema) {
    try {
        //  install dependancies
        const config = await promptForTanstackConfig(bonita_config);
        await installPackages([" @tanstack/router@beta"]);  
        await installPackages(["-D"," @tanstack/router-devtools@beta"]);  
    
        
    


    } catch (error: any) {
        printHelpers.error("Error installing pandacss  :\n" + error.message);
        process.exit(1);
    }
}
