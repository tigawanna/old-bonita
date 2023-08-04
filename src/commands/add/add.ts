import { getBonitaConfig } from "@/utils/config/config";
import { Command } from "commander";
import { installTailwind } from "../../utils/installers/tailwind/tailwind";
import { installPanda } from "@/utils/installers/panda/panda";
import { printHelpers } from "@/utils/helpers/print-tools";
import { installTanstackRouter } from "@/utils/installers/tanstack/target/vite-spa";
import { add_command_args } from "./args";
const program = new Command();

export const addCommand = program
  .command("add")
  .description("add packages to your project")
  .argument("[inputs...]", "string to split")
  .action(async (args) => {
    const config = await getBonitaConfig();
    const parsed_args = await add_command_args(args);
    const pkg_installs = parsed_args.map(async (input) => {
      if (input === "tailwind") {
        return installTailwind(config);
      }
      if (input === "panda") {
        return installPanda(config);
      }
      if (input === "tanstack") {
        return installTanstackRouter(config);
      } else {
        return Promise.resolve(); // or handle the case for other inputs
      }
    });

    Promise.all(pkg_installs)
      .then(() => {
        // console.log(printHelpers.checkmark);
      })
      .catch((error) => {
        console.error(
          printHelpers.error("Failed to install packages:"),
          error.message,
        );
      });
  });
