import { TBonitaConfigSchema, getBonitaConfig } from "@/utils/config/config";
import { Command } from "commander";
import { installTailwind } from "../../utils/installers/tailwind/tailwind";
import { installPanda } from "@/utils/installers/panda/panda";
import { TAddArgs, add_command_args } from "./args";
import { installTanstack } from "@/utils/installers/tanstack/tanstack";
import { multiselect } from "prask";
import { promptToInstall } from "@/utils/helpers/propmt";
const program = new Command();

export const addCommand = program
  .command("add")
  .description("add packages to your project")
  .argument("[inputs...]", "string to split")
  .action(async (args) => {
    const config = await getBonitaConfig();

    if (args.length === 0) {
      return listAddablePackages(config);
    }
    const packages = await add_command_args(args);

    if (packages.includes("tailwind")) {
      await installTailwind(config);
    }
    if (packages.includes("panda")) {
      await installPanda(config);
    }
    if (packages.includes("tanstack")) {
      await installTanstack(config);
    }
    await promptToInstall()
  });

export async function listAddablePackages(config: TBonitaConfigSchema) {
  const result = await multiselect<TAddArgs[number]>({
    /* REQUIRED OPTIONS */
    message: "Which packages would you like to add?", // The message that the user will read
    options: [
      { title: "TailwindCSS", value: "tailwind" },
      { title: "PandaCSS", value: "panda" },
      { title: "Tanstack", value: "tanstack" },
    ],
    /* OPTIONAL OPTIONS */
    limit: 10, // Limit to this number the maximum number of options visible at one time
    min: 1, // Require at least this number of options to be selected
    //  Require at most this number of options to be selected
    searchable: false, // Turn off support for filtering the list of options
  });

  const packages = result && result;
  if (packages) {
    if (packages.includes("tailwind")) {
      await installTailwind(config);
    }
    if (packages.includes("panda")) {
      await installPanda(config);
    }
    if (packages.includes("tanstack")) {
      await installTanstack(config);
    }
    await promptToInstall()
  }
}
