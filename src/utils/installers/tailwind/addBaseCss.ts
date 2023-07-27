import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { tailwind_base_css } from "./templates";

export async function addBaseTWcss(inde_styles_path: string) {
  try {
    const index_css_exists = await existsSync(inde_styles_path);
    if (!index_css_exists) {
      return await writeFile(inde_styles_path, tailwind_base_css);
    }
    const index_css = await readFile(inde_styles_path, { encoding: "utf-8" });
    if (!index_css) {
      return await writeFile(inde_styles_path, tailwind_base_css);
    }
    const tailwindRegex = /@tailwind (base|components|utilities);/g;
    let matches = index_css.match(tailwindRegex);
    let containsAllDirectives = matches !== null && matches.length === 3;
    if (matches !== null && matches.length !== 3) {
      const new_index_css =
        tailwind_base_css + "\n" + index_css.replace(tailwindRegex, "").trim();
      return writeFile(inde_styles_path, new_index_css);
    }
    if (containsAllDirectives) {
      return;
    }
    const new_base_css = tailwind_base_css + index_css;
    return writeFile(inde_styles_path, new_base_css);
  } catch (error) {
    throw error;
  }
}
