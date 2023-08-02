import { readFile, writeFile } from "fs/promises";
import { parseModule, generateCode } from "magicast";
import { addVitePlugin } from "magicast/helpers";
import { printHelpers } from "../print-tools";
export async function addViteTSPathAlias() {
  try {
    const vite_config_file = await readFile("vite.config.js", { encoding: "utf-8" });
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
  } catch (error: any) {
    printHelpers.error("error adding vite-tsconfig-paths " + error.message);
    throw error;
  }
}
