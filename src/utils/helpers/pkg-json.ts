import { destr } from "destr";
import { readFile } from "fs/promises";
import { IPackageJson } from "./types";

export async  function getPkgJson(){
    try {
        const pkg_json = await readFile("./package.json", "utf-8");
        if (!pkg_json) {
            throw new Error("package.json not found");
        }
        const package_json = destr<IPackageJson>(pkg_json)
        return package_json
    } catch (error) {
        throw new Error("error getting package json");
    }
}
