
import { IFrameworkType } from "gluegun-toolbox";
import { system, print, loader, asyncLoader } from "gluegun-toolbox"
import { getPackageManager, packageExecCommand } from "@/helpers/utils/get-package-manager.ts";
import { writeFileAsync } from "@/helpers/toolbox/fs/crud-file.ts";
import { react_vite_tailwind_config_template } from "./uitls/tailwind-config-template.ts";
import { addBaseTWcss } from "./uitls/addBaseCss.ts";
// import { print} from "gluegun-toolbox"

type TFrameworkMap = {
    [key in IFrameworkType]: () => Promise<void>;
}
export type FrameworkInstallerObject = Pick<TFrameworkMap,"React+Vite"|"Nextjs">;
// const tailwind_installers_map: FrameworkInstallerObject = {
// "React+Vite": installTWOnViteReact,
// "Nextjs": installTWOnViteReact,
// }

export async function installTailwind(framework: keyof FrameworkInstallerObject) {
try {
    const packageManager = await getPackageManager('./')
    const packages = ["tailwindcss", "postcss", "autoprefixer"];
    const install_packages_command = packageManager + " install -D tailwindcss " + packages.join(" ")
    await asyncLoader(system.run(install_packages_command), "adding tailwindcss");
    await asyncLoader(system.run(packageExecCommand(packageManager) + " tailwindcss init -p"), "updating tailwindcss config");
    await writeFileAsync("tailwind.config.js", react_vite_tailwind_config_template);
    
    const base_styles_spinner =await loader("adding base styles");
    if(framework === "React+Vite"){
    await addBaseTWcss("./src/index.css")
    }
    if(framework === "Nextjs"){
    await addBaseTWcss("./pages/index.css")
    }
    base_styles_spinner.succeed();
 
    return
} catch (error) {
    // print.error("error installing tailwind :" + error);
    process.exit(1);

}
}
