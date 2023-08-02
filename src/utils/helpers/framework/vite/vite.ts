import { readFile, writeFile } from "fs/promises";
import { parseModule, generateCode } from "magicast";
import { addVitePlugin } from "magicast/helpers";
import { printHelpers } from "../../print-tools";
import { addTsconfigPathAlias } from "../../json/json-configs";
import { existsSync } from "fs";
import { pathExists } from "../../fs/files";
export async function addViteTSPathAlias() {
  try {
    const vite_config_file_path = pathExists(["./vite.config.js", "./vite.config.ts"]);
    if (!vite_config_file_path) {
      const generis_vite_config = `
   import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'    
    import tsconfigPaths from "vite-tsconfig-paths"
    // https://vitejs.dev/config/
    export default defineConfig({
    server: {
        port: 3000,
        host: true
     },
    plugins: [react(), tsconfigPaths(),],
    })
`;
      await writeFile("vite.config.ts", generis_vite_config, {
        encoding: "utf-8",
      });
      return "no vite config file found, added a generic one in vite.config.ts";
    }
    const vite_config_file = await readFile(vite_config_file_path, { encoding: "utf-8" });
    const mod = parseModule(vite_config_file);
    mod.exports
    addVitePlugin(mod, {
      from: "vite-tsconfig-paths",
      constructor: "tsconfigPaths",
      imported: "default",
    });
    const { code} = generateCode(mod);
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
