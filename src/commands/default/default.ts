import { getBonitaConfig } from "@/utils/config/config";
import { Command } from "commander";



const program = new Command();

export const defaultCommand = program
    .command("bonita")
    .description("default bonita ")
    .action(async (args) => {
        const config = await getBonitaConfig();

    });
