import { TBonitaConfigSchema } from "@/utils/config/config";
import {
  execPackageManagerCommand,

  installPackages,

} from "@/utils/helpers/package-managers";

import { addBaseTWcss } from "@/utils/installers/tailwind/addBaseCss";
import { validateRelativePath } from "@/utils/helpers/strings/general";
import {
  updateTwPlugins,
  tailwind_config_template,
  tailwind_base_css,
} from "./templates";
import { promptForTWConfig } from "./prompts";
import { z } from "zod";
import { loader } from "@/utils/helpers/loader-tools";
import { execa } from "execa";
import { printHelpers } from "@/utils/helpers/print-tools";
import { writeFile } from "fs/promises";

// Define the tailwind schema
export const tailwindSchema = z.object({
  tw_config: z.string().default("tailwind.config.js"),
  tw_plugins: z.array(z.string()).default([]),
});

export type TTailwindConfigSchema = z.infer<typeof tailwindSchema>;

export async function installTailwind(bonita_config: TBonitaConfigSchema) {
  try {
    const config = await promptForTWConfig(bonita_config);

    const root_styles = validateRelativePath(config.root_styles);
    const tw_config_path = validateRelativePath(config.tailwind?.tw_config);
    const framework = config.framework;

    const tw_plugins = config.tailwind?.tw_plugins;
 

    const packages = ["tailwindcss", "postcss", "autoprefixer"];
    await installPackages(["-D", ...packages, ...tw_plugins]);
    await execPackageManagerCommand(["tailwindcss", "init", "-p"]);
   


    const tw_config_spinners = await loader("adding tailwind configs");
    if (tw_plugins && tw_plugins?.length > 0) {
      const tw_config_with_plugins = updateTwPlugins(tw_plugins);
      await writeFile(
        tw_config_path ?? "tailwind.config.js",
        tw_config_with_plugins,
      )
        .then((res) => {
          tw_config_spinners.succeed();
          return res;
        })
        .catch((error) => {
          printHelpers.error("Error adding tw config  :\n" + error.message);
          printHelpers.info("try instalig them manually and try again");
          printHelpers.info(tw_config_with_plugins);
          tw_config_spinners.failed();
          process.exit(1);
        });
    } else {
      await writeFile(
        tw_config_path ?? "tailwind.config.js",
        tailwind_config_template,
      )
        .then((res) => {
          tw_config_spinners.succeed();
          return res;
        })
        .catch((error) => {
          printHelpers.error("Error adding tw config  :\n" + error.message);
          printHelpers.info("try instalig them manually and try again");
          printHelpers.info(tailwind_config_template);
          tw_config_spinners.failed();
          process.exit(1);
        });
    }

    // add base styles into root css file
    // printHelpers.debug({framework,root_styles},"adding base styles into root css file");
    const base_styles_spinner = await loader("adding base styles");
    if (framework === "React+Vite") {
      await addBaseTWcss(root_styles)
        .then((res) => {
          base_styles_spinner.succeed();
        return res;
        })
        .catch((error) => {
          printHelpers.error(
            "Error adding base styles in app dir :\n" + error.message,
          );
          printHelpers.info("try adding manually and try again");
          printHelpers.info(tailwind_base_css);
          base_styles_spinner.failed();
          process.exit(1);
        });
    }
    if (framework === "Rakkasjs") {
      await addBaseTWcss(root_styles)
        .then((res) => {
          base_styles_spinner.succeed();
          return res;
        })
        .catch((error) => {
          printHelpers.error("Error adding base styles  :\n" + error.message);
          printHelpers.info("try adding manually and try again");
          printHelpers.info(tailwind_base_css);
          base_styles_spinner.failed();
          process.exit(1);
        });
    }
    if (framework === "Nextjs") {
      // printHelpers.debug({framework,root_styles},"adding base styles into root css file");
      // printHelpers.info("adding base styles into" + root_dir ?? "./src/index.css");
      await addBaseTWcss(root_styles)
        .then((res) => {
          base_styles_spinner.succeed();
          return res;
        })
        .catch((error) => {
          base_styles_spinner.failed();
          printHelpers.error("Error adding base styles :\n" + error.message);
          printHelpers.info("try adding manually and try again");
          printHelpers.info(tailwind_base_css);
          process.exit(1);
        });
    }
    base_styles_spinner.succeed();
  } catch (error: any) {
    printHelpers.error("Error installing Tailwind  :\n" + error.message);
    process.exit(1);
  }
}
