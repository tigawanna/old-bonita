import { frameworkDefaults } from "@/utils/helpers/framework/framework";
import { checkFramework } from "@/utils/helpers/framework/whatFramework";
import { string, select } from "prask";
import { TBonitaConfigSchema, saveConfig } from "../config";

export async function promptForConfig() {
  try {
    const framework_type = await checkFramework();
    const { root_dir, root_styles, state, components } =
      frameworkDefaults(framework_type);
    const answers: TBonitaConfigSchema = {
      root_dir:
        (await string({ message: "root directory ?", initial: root_dir })) ??
        root_dir,
      root_styles:
        (await string({ message: "Main css file ?", initial: root_styles })) ??
        root_styles,
      framework:
        framework_type ??
        (await select({
          message: "Framework ?",
          options: [
            { value: "React+Vite", title: "React+Vite" },
            { value: "Nextjs", title: "Nextjs" },
          ],
        })),
      state:
        (await string({ message: "state directory ?", initial: state })) ??
        state,
      components:
        (await string({
          message: "components directory ?",
          initial: components,
        })) ?? components,
    };

    saveConfig(answers);
    return answers;
  } catch (error: any) {
    throw new Error("error prompting for config" + error.message);
  }
}
