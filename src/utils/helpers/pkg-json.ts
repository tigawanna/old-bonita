import { readFile } from "fs/promises";
import { IPackageJson } from "./pkg-manager/types";
import { safeJSONParse } from "./json/json";


export async function getPkgJson(path: string = "./package.json"): Promise<IPackageJson> {
  try {
    const pkg_json = await readFile(path, "utf-8");
    if (!pkg_json) {
      throw new Error("package.json not found");
    }
    const package_json = safeJSONParse<IPackageJson>(pkg_json);
    return package_json;
  } catch (error) {
    throw new Error("error getting package json");
  }
}

export async function addDepsToPackageJsons(deps: string[],dev_dep: boolean,pkg_json_path: string = "./package.json") {
  try {
    const pkgs_as_json = deps.reduce<{[key: string]: string }>((acc, dep) => {
      acc[dep] = "latest";
      return acc;
    }, {});
    const pkg_json = await getPkgJson(pkg_json_path);
if(dev_dep){
  pkg_json.devDependencies = {...pkgs_as_json,...pkg_json.devDependencies};
}else{
  pkg_json.dependencies ={...pkgs_as_json,...pkg_json.dependencies};
}
console.log("new package json ==",pkg_json);
  // await writeFile(pkg_json_path, JSON.stringify(pkg_json, null, 2), "utf8");
  } catch (error) {

  }
}


