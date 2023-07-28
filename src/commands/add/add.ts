import { getBonitaConfig } from "@/utils/config/config";
import { Command } from "commander";
import { z } from "zod";
import { installTailwind } from "../../utils/installers/tailwind/tailwind";
import { installPanda } from "@/utils/installers/panda/panda";
import { printHelpers } from "@/utils/helpers/print-tools";
const program = new Command();
const addArgsShema = z
  .array(z.enum(["tailwind", "panda"]))
  .default(["tailwind", "panda"]);

type TAddArgs = z.infer<typeof addArgsShema>;

export const addCommand = program
  .command("add")
  .description("add packages to your project")
  .argument("[inputs...]", "string to split")
  .action(async (args) => {
    const parsed_args = addArgsShema.parse(args);
    const config = await getBonitaConfig();

    const pkg_installs = parsed_args.map(async (input) => {
      if (input === "tailwind") {
        return installTailwind(config);
      }
      if (input === "panda") {
        return installPanda(config);
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
