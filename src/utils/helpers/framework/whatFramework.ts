import kleur from "kleur";
import { IPackageJson } from "../types";
import { readFile } from "fs/promises";
import { getPkgJson } from "../pkg-json";
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
    const framework = frameworkType(await getPkgJson());
    console.log(kleur.green(framework + " detected"));
    return framework;
  } catch (error) {
    throw error;
  }
}
