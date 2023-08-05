import { printHelpers } from "@/utils/helpers/print-tools";
import { z } from "zod";


const pageOptionsArgsSchema = z.array(z.string());
export type TPageOptionsArgs = z.infer<typeof pageOptionsArgsSchema>;

export async function page_command_args(args: any) {
  try {

    const parsed_args = await pageOptionsArgsSchema.parse(args);
    return parsed_args;
  } catch (error: any) {
    printHelpers.error("invalid arguments: " + error.message);
    process.exit(1);
  }
}
