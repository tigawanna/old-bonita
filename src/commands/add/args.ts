import { printHelpers } from "@/utils/helpers/print-tools";
import { z } from "zod";

const addArgsShema = z
    .array(z.enum(["tailwind", "panda", "tanstack-router"]))
    .default(["tailwind", "panda", "tanstack-router"]);

type TAddArgs = z.infer<typeof addArgsShema>;

export async function add_command_args(args:any) {
    try {
        const parsed_args = await addArgsShema.parse(args)
        return parsed_args
    } catch (error:any) {
        printHelpers.error("invalid arguments: " + error.message)
        process.exit(1)
    }
}
