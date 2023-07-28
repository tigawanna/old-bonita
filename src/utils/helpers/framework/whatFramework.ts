import kleur from "kleur";
import { IPackageJson } from "../types";
import { readFile } from "fs/promises";
export const supportedFrameworks = [
  "React+Vite",
  "Rakkasjs",
  "Nextjs",
  "Others",
] as const;
export type TFrameworkType = (typeof supportedFrameworks)[number];

export function frameworkType(pkg: IPackageJson): TFrameworkType {
  if (pkg.devDependencies?.rakkasjs) {
    return "Rakkasjs";
  } else if (pkg.dependencies?.next) {
    return "Nextjs";
  } else if (pkg.devDependencies?.vite && pkg.dependencies?.react) {
    return "React+Vite";
  }
  return "Others";
}

export async function checkFramework() {
  try {
    const pkg_json = await readFile("./package.json", "utf-8");
    if (!pkg_json) {
      throw new Error("package.json not found");
    }
    const framework = frameworkType(JSON.parse(pkg_json));
    console.log(kleur.green(framework + " detected"));
    return framework;
  } catch (error) {
    throw error;
  }
}
