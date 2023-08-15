import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { postcss_templlate, tailwind_base_css, tailwind_config_template } from "./templates";
import Spinnies from "spinnies";
import { safeJSONParse } from "@/utils/helpers/json/json";
import { printHelpers } from "@/utils/helpers/print-tools";
import { IPackageJson } from "@/utils/helpers/pkg-manager/types";
import { getDepsJson, getPkgJson } from "@/utils/helpers/pkg-json";
import { merge } from "remeda";

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

export async function getPkgJsonTailwindDeps() {
  const spinnie = new Spinnies();
  spinnie.add("fetching", { text: "checking latest tailwind versions" });
  const url = `https://github.com/tailwindlabs/tailwindcss.com/raw/master/package.json`;
  const headers = {
    Accept: "application/json",
  };
  return fetch(url, { headers })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.text();
    })
    .then((data) => {
      spinnie.succeed("fetching");
      const pkg_json = safeJSONParse<IPackageJson>(data);
      return pkg_json;
    })
    .catch((error) => {
      spinnie.fail("fetching", { text: error.message });
      printHelpers.error(error);
      throw error;
    });
}


export async function addTailwindDeps() {
  const spinnies = new Spinnies();
  try {
    spinnies.add("fetching", { text: "adding tailwind deps" });
    const pkg_json = await getPkgJson();
    const tw_deps_json = await (await getDepsJson()).tailwind
    const new_deps = merge(pkg_json.devDpendencies,tw_deps_json)

    
    // await writeFile("./package.json", JSON.stringify({ name, version }, null, 2), "utf8");
    spinnies.succeed("fetching");
  } catch (error) {
    throw error;
  }
}

export async function tailwindInit(){
  const spinnies = new Spinnies()
  spinnies.add("main", { text: "adding tailwind" })
  try {
   await writeFile("tailwind.config.js", tailwind_config_template)
   await writeFile("postcss.config.js",postcss_templlate)
  } catch (error: any) {
    spinnies.fail("main", { text: error.message })
    // throw error
    
  }
}
