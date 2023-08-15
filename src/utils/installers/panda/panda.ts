import { TBonitaConfigSchema } from "@/utils/config/config";
import { getPackageManager, packageExecCommand } from "@/utils/helpers/pkg-manager/package-managers";
import { validateRelativePath } from "@/utils/helpers/strings/general";
import { promptForPandaConfig } from "../../config/prompts/panda";
import { z } from "zod";
import {
  addPandaScript,
  panda_base_css,
  panda_config_template,
} from "./templates";
import { writeFile } from "fs/promises";
import { printHelpers } from "@/utils/helpers/print-tools";
import Spinnies from "spinnies";
import { boolean } from "prask";
import { addBasePandacss, addPandaDeps } from "./config_panda";
import { promptToInstall } from "@/utils/helpers/propmt";

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

    const panda_prepare_spinners = new Spinnies();
    panda_prepare_spinners.add("prepare", {
      text: "adding panda prepare script",
    });
    addPandaScript()
      .then(() => {
        panda_prepare_spinners.succeed("prepare");
      })
      .catch((error) => {
        printHelpers.error(
          "Error adding panda prepare script  :\n" + error.message,
        );
        printHelpers.info(
          "try instalig them manually into the package.json scripts",
        );
        printHelpers.info(`"prepare": "panda codegen"`);
        panda_prepare_spinners.fail("prepare", { text: error.message });
        // process.exit(1);
      });

    const panda_config_spinners = new Spinnies();
    panda_config_spinners.add("config", { text: "adding panda config script" });
    await writeFile(panda_config_path, panda_config_template, "utf8")
      .then((res) => {
        panda_config_spinners.succeed("config");
        return res;
      })
      .catch((error) => {
        printHelpers.error("Error adding tw config  :\n" + error.message);
        printHelpers.info("try instalig them manually and try again");
        printHelpers.info(panda_config_template);
        panda_config_spinners.fail("config", { text: error.message });
        // process.exit(1);
      });

    // add base styles into root css file
    // printHelpers.debug({framework,root_styles},"adding base styles into root css file");

    const panda_base_spinners = new Spinnies();
    panda_base_spinners.add("base-styles", { text: "adding base styles" });

    await addBasePandacss(root_styles)
      .then((res) => {
        panda_base_spinners.succeed("base-styles");
        return res;
      })
      .catch((error) => {
        printHelpers.info("try adding manually and try again");
        printHelpers.info(panda_base_css);
        panda_base_spinners.fail("base-styles", { text: error.message });
        // process.exit(1);
      });

    const consent =
      (await boolean({
        message: "Do you want to isntall the panda depenancies?",
        initial: true,
      })) ?? true;

    if (!consent) {
      const package_manager = await getPackageManager(".");
      const install_command = packageExecCommand(package_manager) + " -D @pandacss/dev";
      printHelpers.info("install them manually by running");
      printHelpers.info(install_command);
      // process.exit(1);
    }
    await addPandaDeps()
    await promptToInstall()


  } catch (error: any) {
      printHelpers.error("Error installing pandacss  :\n" + error.message);
      throw error;
    // process.exit(1);
  }
}
