
import { system, loader,writeFileAsync, print } from "gluegun-toolbox"
import { getPackageManager, packageExecCommand } from "@/helpers/utils/get-package-manager.ts";
import { addBaseTWcss } from "./uitls/addBaseCss.ts";
import { execSync } from "child_process";
import { tailwind_config_template, updateTwPlugins } from "@/commands/add/utils/consts.ts";
import { TBonitaConfigSchema } from "@/helpers/utils/config.ts";
import { validateRelativePath } from "@/commands/add/utils/paths.ts";

export async function installTailwind(config:TBonitaConfigSchema){

try {
    const framework = config.framework
    const tw_config_path = validateRelativePath(config.tailwind?.tw_config??"tailwind.config.js")
    const tw_plugins = config.tailwind?.tw_plugins
    const root_dir = config.root_dir
    const root_styles = validateRelativePath(config.root_styles)

    const packageManager = await getPackageManager('./')
    const packages = ["tailwindcss", "postcss", "autoprefixer"];
    const install_packages_command = packageManager + " install -D tailwindcss"+ " " 
    + packages.join(" ") +" "+tw_plugins?.join(" ")

    //  install tailwind and dependancies
    const installing_pkgs_spinners = await loader("installing packages");
    print.info("installing packages");
    system.run(install_packages_command)
    print.info("tailwindcss init -p");
    system.run(packageExecCommand(packageManager) + " tailwindcss init -p")
    installing_pkgs_spinners.succeed();
    
    //  add tailwind confuh
    if (tw_plugins&&tw_plugins?.length>0){
        const tw_config_with_plugins = updateTwPlugins(tw_plugins)
        await writeFileAsync(tw_config_path ?? "tailwind.config.js", tw_config_with_plugins);
    }else{
        await writeFileAsync(tw_config_path??"tailwind.config.js", tailwind_config_template);
    }

    

    
    print.info("adding base styles into" + root_dir ?? "./src/index.css");
    const base_styles_spinner =await loader("adding base styles");

    if(framework === "React+Vite"){
    await addBaseTWcss(root_styles??"./src/index.css")
    }
    if(framework === "Nextjs"){
        if (execSync(root_styles ?? "./src/app/globals.css")){
            // print.info("adding base styles into" + root_dir ?? "./src/index.css");
            await addBaseTWcss(root_styles ?? "./src/app/globals.css")
    }
        if (execSync(root_dir ?? "./src/pages/globals.css")){
            // print.info("adding base styles into" + root_dir ?? "./src/index.css");
            await addBaseTWcss(root_styles ?? "./src/app/globals.css")
    }
        
    }
    base_styles_spinner.succeed();
 
    return
} catch (error) {
    // print.error("error installing tailwind :" + error);
    process.exit(1);

}
}
