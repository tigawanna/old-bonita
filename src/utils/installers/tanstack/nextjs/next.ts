import { TBonitaConfigSchema } from "@/utils/config/config";
import { z } from "zod";
import {
  fetchNextjsTanstackTemplates,
  updateNextJsfilesWithTemplates,
} from "./remote-templates";
import { boolean } from "prask";

export const nextjsReactSchema = z.object({
  src_dir: z.boolean().default(true),
});

export type TNextjsReactConfigSchema = z.infer<typeof nextjsReactSchema>;

export async function addNextjsTanstack(bonita_config: TBonitaConfigSchema) {
  try {
    const consent = await boolean({
      message:
        "This will overwrite sapp/page.tsx and app/layout.tsx. Do you want to continue?",
      initial: true,
    });
    if (!consent) {
      process.exit(1);
    }
    const templates = await fetchNextjsTanstackTemplates();
    await updateNextJsfilesWithTemplates(templates, bonita_config);
  } catch (error: any) {
    process.exit(1);
  }
}
