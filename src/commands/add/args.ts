import { printHelpers } from "@/utils/helpers/print-tools";
import { z } from "zod";
const add_args = ["tailwind", "panda", "tanstack"] as const
const addArgsShema = z
    .array(z.enum(add_args))


export type TAddArgs = z.infer<typeof addArgsShema>;

export async function add_command_args(args:any) {
    try {
        const parsed_args = await addArgsShema.parse(args)
        return parsed_args
    } catch (error:any) {
        printHelpers.error("invalid arguments: " + error.message)
        process.exit(1)
    }
}
