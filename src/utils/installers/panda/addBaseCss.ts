import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { panda_base_css } from "./templates";


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
