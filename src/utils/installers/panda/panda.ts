import { TBonitaConfigSchema } from "@/utils/config/config";
import { getPackageManager } from "@/utils/helpers/get-package-manager";
import { addBaseTWcss } from "@/utils/installers/tailwind/addBaseCss";
import { validateRelativePath } from "@/utils/helpers/strings/general";
import { promptForPandaConfig } from "./prompts";
import { execa } from "execa";
import { z } from "zod";
import {
  addPandaScript,
  panda_base_css,
  panda_config_template,
} from "./templates";
import { writeFile } from "fs/promises";
import { loader } from "@/utils/helpers/loader-tools";
import { printHelpers } from "@/utils/helpers/print-tools";

// Define the tailwind schema
export const pandaSchema = z.object({
  panda_config_path: z.string().default("panda.config.ts"),
});

export type TPandaConfigSchema = z.infer<typeof pandaSchema>;

export async function installPanda(bonita_config: TBonitaConfigSchema) {
  try {
    const config = await promptForPandaConfig(bonita_config);

    const root_styles = validateRelativePath(config.root_styles);
    const panda_config_path = validateRelativePath(
      config.panda.panda_config_path,
    );
    const framework = config.framework;
    const packageManager = await getPackageManager("./");
    const install_packages_command =
      packageManager + ` install "-D @pandacss/dev" `;
    const installing_pkgs_spinners = await loader(
      "installing pandacss dependancies",
    );
    await execa("pnpm", ["install", "-D", "@pandacss/dev"])
      .then((res) => {
        installing_pkgs_spinners.succeed();
        printHelpers.info(res.command);
        printHelpers.info(res.stdout);
      })
      .catch((error) => {
        installing_pkgs_spinners.failed();
        printHelpers.error(
          "Error installing pandacss dependancies  :\n" + error.message,
        );
        printHelpers.info("try instalig them manually and try again");
        printHelpers.info(install_packages_command);
        process.exit(1);
      });

    const add_panda_script_spinners = await loader(
      "adding panda prepare script",
    );
    addPandaScript()
      .then(() => {
        add_panda_script_spinners.succeed();
      })
      .catch((error) => {
        printHelpers.error(
          "Error adding panda prepare script  :\n" + error.message,
        );
        printHelpers.info(
          "try instalig them manually into the package.json scripts",
        );
        printHelpers.info(`"prepare": "panda codegen"`);
        add_panda_script_spinners.failed();
        process.exit(1);
      });

    const panda_config_spinners = await loader("adding panda configs");
    await writeFile(panda_config_path, panda_config_template, "utf8")
      .then((res) => {
        panda_config_spinners.succeed();
        return res;
      })
      .catch((error) => {
        printHelpers.error("Error adding tw config  :\n" + error.message);
        printHelpers.info("try instalig them manually and try again");
        printHelpers.info(panda_config_template);
        panda_config_spinners.failed();
        process.exit(1);
      });

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
          printHelpers.info(panda_base_css);
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
          printHelpers.info(panda_base_css);
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
          printHelpers.info(panda_base_css);
          process.exit(1);
        });
    }
    base_styles_spinner.succeed();
  } catch (error: any) {
    printHelpers.error("Error installing pandacss  :\n" + error.message);
    process.exit(1);
  }
}
