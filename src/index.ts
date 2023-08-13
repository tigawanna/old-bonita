import { Command } from "commander";
import { addCommand } from "./commands/add/add.ts";
import { pageCommand } from "./commands/page/page.ts";
import { defaultCommand } from "./commands/default/default.ts";
const program = new Command();

program.name("bonita").description("cli toolkit for frontend development");
program.addCommand(defaultCommand);
program.addCommand(addCommand);
program.addCommand(pageCommand);

program.parse();
