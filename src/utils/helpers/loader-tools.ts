import { Spinner } from "@topcli/spinner";
import kleur from "kleur";
import { getPackageManager } from "./package-managers";
import { execa } from "execa";
import { printHelpers } from "./print-tools";

export async function asyncLoader<T>(
  promise: Promise<T>,
  title?: string,
): Promise<T> {
  const spinner = new Spinner().start("Start working!");
  spinner.text = title ? title + " running..." : "task running...";
  try {
    const result = await promise;
    spinner.succeed(kleur.green("✔︎"));
    return result;
  } catch (error: any) {
    spinner.failed(kleur.red(title + "taks failed"));
    console.log(kleur.red(error.messge));
    throw error;
  }
}

export async function loader(title: string) {
  return new Spinner().start(title);
}



