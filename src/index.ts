import { Command } from 'commander';
import { addCommand } from './commands/add/add.ts';
const program = new Command();

program.name('bonita').description('cli toolkit for frontend development')
program.addCommand(addCommand)
program.parse();
