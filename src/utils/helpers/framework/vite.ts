import { readFile, writeFile } from "fs/promises";
import { parseModule, generateCode } from "magicast";
import { addVitePlugin } from "magicast/helpers";
import { printHelpers } from "../print-tools";
import { addTsconfigPathAlias } from "../json/json-configs";
import { existsSync } from "fs";
export async function addViteTSPathAlias() {
    try {

        const vite_config_file_path = existsSync("vite.config.js") ? "vite.config.js" : "vite.config.ts";
        const vite_config_file = await readFile(vite_config_file_path, { encoding: "utf-8" });
        const mod = parseModule(vite_config_file);
        addVitePlugin(mod, {
            from: "vite-tsconfig-paths",
            constructor: "tsconfigPaths",
            imported: "default",
        });
        const { code, map } = generateCode(mod);
        await writeFile("vite.config.js", code, {
            encoding: "utf-8",
        });
        printHelpers.success("added vite-tsconfig-paths");
        await addTsconfigPathAlias();

        return "vite-tsconfig-paths added";
    } catch (error: any) {
        printHelpers.error("error adding vite-tsconfig-paths " + error.message);
        throw error;
    }
}
