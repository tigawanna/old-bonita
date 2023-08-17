import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { postcss_templlate, tailwind_base_css, tailwind_config_template, updateTwPlugins } from "./templates";
import Spinnies from "spinnies";
import { safeJSONParse } from "@/utils/helpers/json/json";
import { printHelpers } from "@/utils/helpers/print-tools";
import { IPackageJson } from "@/utils/helpers/pkg-manager/types";
import { getDepsJson, getPkgJson } from "@/utils/helpers/pkg-json";
import { merge } from "remeda";
import { validateRelativePath } from "@/utils/helpers/strings/general";
import { TBonitaConfigSchema } from "@/utils/config/config";
import { promptForTWConfig } from "./prompts";
import { checkFramework, frameworkType } from "@/utils/helpers/framework/whatFramework";

export async function addBaseTWcss(inde_styles_path: string) {
  const tailwind_base_css_spinners = new Spinnies();
  tailwind_base_css_spinners.add("base-styles", {
    text: "adding base css styles ",
  });
  try {
    const index_css_exists = await existsSync(inde_styles_path);
    if (!index_css_exists) {
      tailwind_base_css_spinners.succeed("base-styles");
      return await writeFile(inde_styles_path, tailwind_base_css);
    }
    const index_css = await readFile(inde_styles_path, { encoding: "utf-8" });
    if (!index_css) {
      tailwind_base_css_spinners.succeed("base-styles",{
        text: "created " + inde_styles_path + "with tailwind base styles"
      });
      return await writeFile(inde_styles_path, tailwind_base_css);
    }
    const tailwindRegex = /@tailwind (base|components|utilities);/g;
    let matches = index_css.match(tailwindRegex);
    let containsAllDirectives = matches !== null && matches.length === 3;
    
    if (matches !== null && matches.length !== 3) {
      const new_index_css =
        tailwind_base_css + "\n" + index_css.replace(tailwindRegex, "").trim();
      tailwind_base_css_spinners.succeed("base-styles",{
        text: "updating base css directives"
      });
      return writeFile(inde_styles_path, new_index_css);
    }
    if (containsAllDirectives) {
      tailwind_base_css_spinners.succeed("base-styles",{
        text: "all base css directives already exist"
      });
      return;
    }
    const new_base_css = tailwind_base_css + index_css;
    writeFile(inde_styles_path, new_base_css);
    tailwind_base_css_spinners.succeed("base-styles", {
      text: "updated base css directives",
    });
    
  } catch (error:any) {
    tailwind_base_css_spinners.fail("base-styles", {
      text: error.message,
    });
    printHelpers.info("try adding manually and try again");
    printHelpers.info(tailwind_base_css);
    printHelpers.info("\n into:" + inde_styles_path);
    throw new Error("Error running tailwind base css :\n" + error.message)
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
  spinnies.add("adding_deps", { text: "adding tailwind deps" });
  try {
    const pkg_json = await getPkgJson();
    const tw_deps_json = await (await getDepsJson()).tailwind
    const new_deps = merge(pkg_json.dependencies,tw_deps_json.main)
    const new_dev_deps = merge(pkg_json.devDependencies,tw_deps_json.dev)
    pkg_json.dependencies = new_deps;
    pkg_json.devDependencies = new_dev_deps
    
    await writeFile("./package.json", JSON.stringify(pkg_json, null, 2), "utf8");
    spinnies.succeed("adding_deps");
  } catch (error: any) {
    spinnies.fail("adding_deps",{ text: error.message });
    throw new Error("error adding tailwind deps \n"+error.message);
  }
}



export async function addTailwindConfig(bonita_config: TBonitaConfigSchema){
  const tailwind_config_spinners = new Spinnies();
  tailwind_config_spinners.add("tw_config", {text: "tailwind init"});
  try {
  const config = await promptForTWConfig(bonita_config);
  const tw_config_path = validateRelativePath(config.tailwind?.tw_config);
  const tw_plugins = config.tailwind?.tw_plugins;


  if (tw_plugins && tw_plugins?.length > 0) {
    const tw_config_with_plugins = updateTwPlugins(tw_plugins);
    await writeFile(tw_config_path ?? "tailwind.config.js", tw_config_with_plugins)
    // tailwind_config_spinners.succeed("tw_config");
  } else {
    await writeFile(tw_config_path ?? "tailwind.config.js", tailwind_config_template)
    // tailwind_config_spinners.succeed("tw_config");
    }
    tailwind_config_spinners.succeed("tw_config");
  } catch (error:any) {
  tailwind_config_spinners.fail("tw_config",{text: error.message});
  throw new Error("Error adding tailwind config:\n" + error.message)
}
}

export async function addTailwindPostcssConfig() {
  const tailwind_config_spinners = new Spinnies();
  tailwind_config_spinners.add("postcss_config", { text: "adding postcss config"});
try {
  const post_css_path = await checkFramework() ==="RedWood"?"postcss.config.mjs":"tailwind.config.js";
  await writeFile(post_css_path, postcss_templlate)
  tailwind_config_spinners.succeed("postcss_config");
} catch (error:any) {
  tailwind_config_spinners.fail("postcss_config", { text: error.message });
  printHelpers.error("Error adding tw postcss config  :\n" + error.message);
  printHelpers.info("try adding manually and try again");
  printHelpers.info(postcss_templlate);
  throw new Error("Error adding postcss.config :\n" + error.message)
}
}



export async function tailwindInit(bonita_config:TBonitaConfigSchema){
try {
  await addTailwindConfig(bonita_config);
  await addTailwindPostcssConfig();

} catch (error: any) {
throw new Error("Error running tailwind init :\n" + error.message)
}
}
