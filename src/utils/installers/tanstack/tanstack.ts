import { TBonitaConfigSchema } from "@/utils/config/config";
import { checkFramework } from "@/utils/helpers/framework/whatFramework";
import { addTanstackToVite } from "./vite/vite-spa";
import { addNextjsTanstack } from "./nextjs/next";
import { printHelpers } from "@/utils/helpers/print-tools";

export async function installTanstack(config:TBonitaConfigSchema) {
    try {
    const framework = await checkFramework()
    if (framework === "React+Vite") {
        addTanstackToVite(config);
    }
    if(framework === "Nextjs"){
        addNextjsTanstack(config);
    }
    // printHelpers.warning(framework+" not yet supported");
    // throw new Error(framework+" not yet supported");
    } catch (error) {
        process.exit(1);
    }
}