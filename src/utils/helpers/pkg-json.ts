import { destr } from "destr";
import { readFile } from "fs/promises";
import { IPackageJson } from "./types";
import { safeJSONParse } from "./json/json";

export async  function getPkgJson(){
    try {
        const pkg_json = await readFile("./package.json", "utf-8");
        if (!pkg_json) {
            throw new Error("package.json not found");
        }
        const package_json = safeJSONParse<IPackageJson>(pkg_json)
        return package_json
    } catch (error) {
        throw new Error("error getting package json");
    }
}
