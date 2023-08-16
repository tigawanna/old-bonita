import { Command } from "commander";
import { addCommand } from "./commands/add/add.ts";
import { pageCommand } from "./commands/page/page.ts";
import { getPkgJson } from "./utils/helpers/pkg-json.ts";
import { printHelpers } from "./utils/helpers/print-tools.ts";
const program = new Command();

program.name("bonita").description("cli toolkit for frontend development");
// program.on("", () => {
    
// })
program.hook("preSubcommand", async(_) => {
const pkg_json = await getPkgJson();
  if(pkg_json.workspaces){
    printHelpers.warning("You appear to be in a workspace , \n consider running this command in your web project's root directory");
    process.exit(1)
  }
})
program.addCommand(addCommand);
program.addCommand(pageCommand);

// program.addCommand(defaultCommand);
program.command('404', { isDefault: true })
    .description("catch all command")
    .argument('[args...]', 'Catch all arguments/flags provided.')

    .allowUnknownOption()
    .action(() => {
        // // maybe show help as fallback.
        // console.log("args",args)
        // console.log("options ",options)
        program.help();
        // console.log("catch all command ", args)
    });


program.parse();
