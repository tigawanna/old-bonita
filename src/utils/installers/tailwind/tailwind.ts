import { TBonitaConfigSchema } from "@/utils/config/config";
import { getPackageManager, packageExecCommand } from "@/utils/helpers/pkg-manager/package-managers";
import { addBaseTWcss, tailwindInit } from "@/utils/installers/tailwind/config_tw";
import { validateRelativePath } from "@/utils/helpers/strings/general";
import {
  updateTwPlugins,
  tailwind_config_template,
  tailwind_base_css,
} from "./templates";
import { promptForTWConfig } from "./prompts";
import { z } from "zod";
import { printHelpers } from "@/utils/helpers/print-tools";
import { writeFile } from "fs/promises";
import Spinnies from "spinnies";
import { boolean } from "prask";
import { addDepsToPackageJsons } from "@/utils/helpers/pkg-json";

// Define the tailwind schema
export const tailwindSchema = z.object({
  tw_config: z.string().default("tailwind.config.js"),
  tw_plugins: z.array(z.string()).default([]),
});

export type TTailwindConfigSchema = z.infer<typeof tailwindSchema>;

export async function installTailwind(bonita_config: TBonitaConfigSchema) {
  // const tailwind_spinners = new Spinnies();
  // tailwind_spinners.add("main", { text: "adding tailwind" });
  try {
    const config = await promptForTWConfig(bonita_config);

    const root_styles = validateRelativePath(config.root_styles);
    const tw_config_path = validateRelativePath(config.tailwind?.tw_config);
    const tw_plugins = config.tailwind?.tw_plugins;

    const tailwind_config_spinners = new Spinnies();
    tailwind_config_spinners.add("config", {
      text: "adding tailwind config file",
    });

    if (tw_plugins && tw_plugins?.length > 0) {
      const tw_config_with_plugins = updateTwPlugins(tw_plugins);
      await writeFile(
        tw_config_path ?? "tailwind.config.js",
        tw_config_with_plugins,
      )
        .then((res) => {
          tailwind_config_spinners.succeed("config");
          return res;
        })
        .catch((error) => {
          tailwind_config_spinners.fail("config", { text: error.message });
          printHelpers.error("Error adding tw config  :\n" + error.message);
          printHelpers.info("try instalig them manually and try again");
          printHelpers.info(tw_config_with_plugins);
          // process.exit(1);
        });
    } else {
      await writeFile(
        tw_config_path ?? "tailwind.config.js",
        tailwind_config_template,
      )
        .then((res) => {
          tailwind_config_spinners.succeed("config");
          return res;
        })
        .catch((error) => {
          tailwind_config_spinners.fail("config", { text: error.message });
          printHelpers.error("Error adding tw config  :\n" + error.message);
          printHelpers.info("try instalig them manually and try again");
          printHelpers.info(tailwind_config_template);
          // process.exit(1);
        });
    }

    // add base styles into root css file
    // printHelpers.debug({framework,root_styles},"adding base styles into root css file");

    const tailwind_base_css_spinners = new Spinnies();
    tailwind_base_css_spinners.add("base-styles", {
      text: "adding base css styles ",
    });

    await addBaseTWcss(root_styles)
      .then((res) => {
        tailwind_base_css_spinners.succeed("base-styles");
        return res;
      })
      .catch((error) => {
        tailwind_base_css_spinners.fail("base-styles", {
          text: error.message,
        });
        printHelpers.error(
          "Error adding base styles in app dir :\n" + error.message,
        );
        printHelpers.info("try adding manually and try again");
        printHelpers.info(tailwind_base_css);
        // process.exit(1);
      });

    const consent = await boolean({
      message: "Do you want to install the tailwind depenancies?",
      initial: true,
    });
    const packages = ["tailwindcss", "postcss", "autoprefixer"];

    if (!consent) {
      const package_manager = await getPackageManager(".");
      const install_command =
        packageExecCommand(package_manager) +
        " -D " +
        packages.join(" ") +
        " " +
        tw_plugins.join(" ");
      printHelpers.info("install them manually by running");
      printHelpers.info(install_command);
      printHelpers.info(
        packageExecCommand(package_manager) + " tailwindcss init -p",
      );
      // process.exit(1);
    }
    // await installPackages(["-D", ...packages, ...tw_plugins]);
    await addDepsToPackageJsons([...packages, ...tw_plugins],true)
    // await execPackageManagerCommand(["tailwindcss", "init", "-p"]);
    await tailwindInit()

    // tailwind_spinners.succeed("main");
  } catch (error: any) {
    // tailwind_spinners.fail("main");
    printHelpers.error("Error installing Tailwind  :\n" + error.message);
    // process.exit(1);
  }
}
