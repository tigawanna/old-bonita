import { TBonitaConfigSchema } from "@/utils/config/config";
import {
  getPackageManager,
  packageExecCommand,
} from "@/utils/helpers/get-package-manager";
import { loader, system, print, writeFileAsync } from "gluegun-toolbox";
import { addBaseTWcss } from "@/utils/installers/tailwind/addBaseCss";
import { validateRelativePath } from "@/utils/helpers/general";
import {
  updateTwPlugins,
  tailwind_config_template,
  tailwind_base_css,
} from "./templates";
import { promptForTWConfig } from "./prompts";
import { z } from "zod";

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
    const packageManager = await getPackageManager("./");

    const packages = ["tailwindcss", "postcss", "autoprefixer"];
    const install_packages_command =
      packageManager +
      " install -D tailwindcss" +
      " " +
      packages.join(" ") +
      " " +
      tw_plugins?.join(" ");

    const installing_pkgs_spinners = await loader(
      "installing Tailwind dependancies"
    );
    await system
      .run(install_packages_command)
      .then(() => {
        installing_pkgs_spinners.succeed();
      })
      .catch((error) => {
        print.error(
          "Error installing Tailwind dependancies  :\n" + error.message
        );
        print.info("try instalig them manually and try again");
        print.info(install_packages_command);
        installing_pkgs_spinners.failed();
        process.exit(1);
      });

    const init_tw_spinners = await loader(
      packageExecCommand(packageManager) + " tailwindcss init -p"
    );
    await system
      .run(packageExecCommand(packageManager) + " tailwindcss init -p")
      .then(() => {
        init_tw_spinners.succeed();
      })
      .catch((error) => {
        print.error("Error initializing tailwind  :\n" + error.message);
        print.info("try instalig them manually and try again");
        print.info(packageExecCommand(packageManager));
        installing_pkgs_spinners.failed();
        process.exit(1);
      });

    const tw_config_spinners = await loader("adding tailwind configs");
    if (tw_plugins && tw_plugins?.length > 0) {
      const tw_config_with_plugins = updateTwPlugins(tw_plugins);
      await writeFileAsync(
        tw_config_path ?? "tailwind.config.js",
        tw_config_with_plugins
      )
        .then((res) => {
          tw_config_spinners.succeed();
          return res;
        })
        .catch((error) => {
          print.error("Error adding tw config  :\n" + error.message);
          print.info("try instalig them manually and try again");
          print.info(tw_config_with_plugins);
          tw_config_spinners.failed();
          process.exit(1);
        });
    } else {
      await writeFileAsync(
        tw_config_path ?? "tailwind.config.js",
        tailwind_config_template
      )
        .then((res) => {
          tw_config_spinners.succeed();
          return res;
        })
        .catch((error) => {
          print.error("Error adding tw config  :\n" + error.message);
          print.info("try instalig them manually and try again");
          print.info(tailwind_config_template);
          tw_config_spinners.failed();
          process.exit(1);
        });
    }

    // add base styles into root css file
    // print.debug({framework,root_styles},"adding base styles into root css file");
    const base_styles_spinner = await loader("adding base styles");
    if (framework === "React+Vite") {
      await addBaseTWcss(root_styles)
        .then((res) => {
          base_styles_spinner.succeed();
          print.success("added base styles");
          return res;
        })
        .catch((error) => {
          print.error(
            "Error adding base styles in app dir :\n" + error.message
          );
          print.info("try adding manually and try again");
          print.info(tailwind_base_css);
          base_styles_spinner.failed();
          process.exit(1);
        });
    }
    if (framework === "Rakkasjs") {
      await addBaseTWcss(root_styles)
        .then((res) => {
          base_styles_spinner.succeed();
          print.success("added base styles");
          return res;
        })
        .catch((error) => {
          print.error("Error adding base styles  :\n" + error.message);
          print.info("try adding manually and try again");
          print.info(tailwind_base_css);
          base_styles_spinner.failed();
          process.exit(1);
        });
    }
    if (framework === "Nextjs") {
      // print.debug({framework,root_styles},"adding base styles into root css file");
      // print.info("adding base styles into" + root_dir ?? "./src/index.css");
      await addBaseTWcss(root_styles)
        .then((res) => {
          base_styles_spinner.succeed();
          print.success("added base styles");
          return res;
        })
        .catch((error) => {
          print.error("Error adding base styles :\n" + error.message);
          print.info("try adding manually and try again");
          print.info(tailwind_base_css);
          base_styles_spinner.failed();
          process.exit(1);
        });
    }
    base_styles_spinner.succeed();
  } catch (error: any) {
    print.error("Error installing Tailwind  :\n" + error.message);
    process.exit(1);
  }
}
