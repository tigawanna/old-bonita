import { detect } from "@antfu/ni";
import { execa } from "execa";
import { loader } from "./loader-tools";
import { printHelpers } from "./print-tools";


export async function getPackageManager(
  targetDir: string,
): Promise<"yarn" | "pnpm" | "bun" | "npm"> {
  const packageManager = await detect({ programmatic: true, cwd: targetDir });

  if (packageManager === "yarn@berry") return "yarn";
  if (packageManager === "pnpm@6") return "pnpm";
  if (packageManager === "bun") return "bun";

  return packageManager ?? "npm";
}

export function packageExecCommand(
  packageManager: "yarn" | "pnpm" | "bun" | "npm",
) {
  switch (packageManager) {
    case "yarn":
      return "yarn";
    case "pnpm":
      return "pnpm dlx";
    case "bun":
      return "bux";
    case "npm":
      return "npx";
  }
}


export async function installPackages(packages: string[]) {
  try {
    const packageManager = await getPackageManager("./");
    const installing_pkgs_spinners = await loader(
      "installing  dependancies",
    );
    await execa(packageManager, ["install", ...packages])
      .then((res) => {
        installing_pkgs_spinners.succeed();
        printHelpers.info(res.command);
        printHelpers.info(res.stdout);
      })
      .catch((error) => {
        installing_pkgs_spinners.failed();
        printHelpers.error(
          "Error installing dependancies  :\n" + error.message,
        );
        printHelpers.info("try instalig them manually and try again");
        printHelpers.info(packageManager + " install" + packages.join(""));
        process.exit(1);
      });

  } catch (error) {
    process.exit(1);
  }
}
export async function execPackageManagerCommand(input: string[]) {
  try {
    const packageManager = await getPackageManager("./");
    const executing_spinners = await loader(
      "running commnand",
    );
    await execa(packageExecCommand(packageManager), [...input])
      .then((res) => {
         executing_spinners.succeed();
        printHelpers.info(res.command);
        printHelpers.info(res.stdout);
      })
      .catch((error) => {
         executing_spinners.failed();
        printHelpers.error(
          "Error running command  :\n" + error.message,
        );
        
        printHelpers.info(packageExecCommand(packageManager)+ input.join(""));
        process.exit(1);
      });

  } catch (error) {
    process.exit(1);
  }
}




