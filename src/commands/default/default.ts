import { Command } from "commander";

const program = new Command();
export const defaultCommand = program.command('404', { isDefault: true })
  .argument('[args...]', 'Catch all arguments/flags provided.')
  .allowUnknownOption()
  .action((args) => {
    // // maybe show help as fallback.
    // program.help();
    console.log("catch all command ", args)
  });
