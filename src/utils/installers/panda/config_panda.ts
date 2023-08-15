import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { panda_base_css } from "./templates";
import Spinnies from "spinnies";
import { getDepsJson, getPkgJson } from "@/utils/helpers/pkg-json";
import { merge } from "remeda";

export async function addBasePandacss(inde_styles_path: string) {
  try {
    const index_css_exists = await existsSync(inde_styles_path);
    if (!index_css_exists) {
      return await writeFile(inde_styles_path, panda_base_css);
    }
    const index_css = await readFile(inde_styles_path, { encoding: "utf-8" });
    if (!index_css) {
      return await writeFile(inde_styles_path, panda_base_css);
    }
    const pandacssRegex = /@layer reset, base, tokens, recipes, utilities;/g;
    const matches = index_css.match(pandacssRegex);
    const containsDirective = matches !== null;
    if (!containsDirective) {
      const new_index_css = panda_base_css + "\n" + index_css;
      return writeFile(inde_styles_path, new_index_css);
    }
    return;
  } catch (error) {
    throw error;
  }
}

export async function addPandaDeps() {
  const spinnies = new Spinnies();
  try {
    spinnies.add("main", { text: "adding panda deps" });
    const pkg_json = await getPkgJson();
    const tw_deps_json = await (await getDepsJson()).panda
    const new_deps = merge(pkg_json.dependencies, tw_deps_json.main)
    const new_dev_deps = merge(pkg_json.devDependencies, tw_deps_json.dev)
    pkg_json.dependencies = new_deps;
    pkg_json.devDependencies = new_dev_deps

    await writeFile("./package.json", JSON.stringify(pkg_json, null, 2), "utf8");
    spinnies.succeed("main");
  } catch (error:any) {
    spinnies.fail("main",{ text: error.message });
    throw error;
  }
}
