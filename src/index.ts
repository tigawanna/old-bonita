import { Command } from "commander";
import { addCommand } from "./commands/add/add.ts";
import { pageCommand } from "./commands/page/page.ts";
const program = new Command();

program.name("bonita").description("cli toolkit for frontend development");
program.addCommand(addCommand);
program.addCommand(pageCommand);
program.parse();
