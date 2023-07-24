import { installTailwind } from "@/helpers/installers/tailwind/tailwind.ts";
import { Command } from "commander";
import { print } from "gluegun-toolbox";
import { z } from "zod";
const program = new Command();
const addArgsShema = z.array(z.enum(["tailwind", "panda"])).default(["tailwind", "panda"])

type TAddArgs = z.infer<typeof addArgsShema>;

export const addCommand = program
  .command("add")
  .description("add packages to your project")
  .argument("[inputs...]", "string to split")
  .action(async (args) => {
    const parsed_args = addArgsShema.parse(args);
    const pkg_installs = parsed_args.map((input) => {
      if (input === "tailwind") {
        return installTailwind("react");
      } else {
        return Promise.resolve(); // or handle the case for other inputs
      }
    });

    Promise.all(pkg_installs)
      .then(() => {
        console.log(print.checkmark);
      })
      .catch((error) => {
        console.error(print.error("Failed to install packages:"), error.message);
      });
  });
