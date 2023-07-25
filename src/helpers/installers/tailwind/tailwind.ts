
import { system, loader,writeFileAsync } from "gluegun-toolbox"
import { getPackageManager, packageExecCommand } from "@/helpers/utils/get-package-manager.ts";
import { addBaseTWcss } from "./uitls/addBaseCss.ts";
import { execSync } from "child_process";
import { FrameworkInstallerObject } from "@/helpers/frameworks/frameworks.ts";
import { tailwind_config_template } from "@/commands/add/utils/consts.ts";

export async function installTailwind(framework: keyof FrameworkInstallerObject) {
try {
    const packageManager = await getPackageManager('./')
    const packages = ["tailwindcss", "postcss", "autoprefixer"];
    const install_packages_command = packageManager + " install -D tailwindcss " + packages.join(" ")

    //  install tailwind and dependancies
    const installing_pkgs_spinners = await loader("installing packages");
    system.run(install_packages_command)
    system.run(packageExecCommand(packageManager))
    installing_pkgs_spinners.succeed();
    
    //  add tailwind confuh
    await writeFileAsync("tailwind.config.js", tailwind_config_template);
    
    const base_styles_spinner =await loader("adding base styles");

    if(framework === "React+Vite"){
    await addBaseTWcss("./src/index.css")
    }
    if(framework === "Nextjs"){
    if(execSync("./src/app/globals.css")){
        await addBaseTWcss("./src/app/globals.css")
    }
    if(execSync("./src/pages/globals.css")){
        await addBaseTWcss("./src/app/globals.css")
    }
        
    }
    base_styles_spinner.succeed();
 
    return
} catch (error) {
    // print.error("error installing tailwind :" + error);
    process.exit(1);

}
}
