import { readFile, writeFile } from "fs/promises";
import { printHelpers } from "../print-tools";
import { safeJSONParse } from "./json";
import { ITSConfigMini } from "../types";

export async function addTsconfigPathAlias() {
  try {
    const ts_config_file = await readFile("tsconfig.json", { encoding: "utf-8" });
    const ts_config_json = await safeJSONParse<Partial<ITSConfigMini>>(ts_config_file);
    if (!ts_config_json) {
      throw new Error("tsconfig not found");
    }
    if (!ts_config_json.compilerOptions) {
      ts_config_json["compilerOptions"] = {
        paths: {
          "@/*": ["./src/*"],
        },
      };
    }

    if (ts_config_json.compilerOptions && !ts_config_json.compilerOptions.paths) {
      ts_config_json["compilerOptions"] = {
        ...ts_config_json["compilerOptions"],
        paths: {
          "@/*": ["./src/*"],
        },
      };
    }

    if (ts_config_json.compilerOptions && ts_config_json.compilerOptions.paths) {
      ts_config_json["compilerOptions"] = {
        ...ts_config_json["compilerOptions"],
        paths: {
          ...ts_config_json["compilerOptions"]["paths"],
          "@/*": ["./src/*"],
        },
      };
    }

    await writeFile("tsconfig.json", JSON.stringify(ts_config_json, null, 2), {
      encoding: "utf-8",
    });
    return "Success: added tsconfig path aliases";
  } catch (error: any) {
    printHelpers.error("error adding tsconfig path alaises " + error.message);
    throw error;
  }
}

