import { generateCode, loadFile, parseModule } from "magicast";
import { getDefaultExportOptions } from "magicast/helpers";
import { pathExists } from "../../fs/files";
import { UserConfig } from "vite";
import fg from "fast-glob";
import { printHelpers } from "../../print-tools";
import { readFile, writeFile } from "fs/promises";


export async function updtaeViteOptions(options: UserConfig) {
  try {
    const vite_path = pathExists(await fg(["vite.config.*"], {}));
    if (!vite_path) {
      return "no vite config found";
    }
    const vite_config = await readFile(vite_path, { encoding: "utf-8" });
    const mod = await loadFile(vite_path);
    const default_config = (await getDefaultExportOptions(mod)) as UserConfig;

    Object.entries(options).forEach(([key, value]) => {
      // @ts-expect-error
      default_config[key] = { ...default_config[key], value };
    });
    const vite_config_mod = parseModule(vite_config);
    //  update the defaultConfig options
    vite_config_mod.exports.default.$args[0] = default_config;
    const { code } = generateCode(vite_config_mod);
    console.log("loaded default config  === ", code);
    await writeFile(vite_path, code, {
      encoding: "utf-8",
    });
  } catch (err: any) {
    throw err;
  }
}

updtaeViteOptions({
  base: "dodo",
}).catch((err) => {
  printHelpers.error("error ", err.message);
});
