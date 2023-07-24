import { system , print,loader,asyncLoader} from "gluegun-toolbox"
import { getPackageManager, packageExecCommand } from "@/helpers/utils/get-package-manager.ts";
import { react_vite_tailwind_config_template} from "./tailwind-config-template.ts";
import { writeFileAsync } from "@/helpers/toolbox/fs/crud-file.ts";


export async function installTWOnViteReact() {
try {  
const packageManager= await getPackageManager('./')    
const packages = ["tailwindcss","postcss", "autoprefixer"];      
const install_packages_command = packageManager + " install -D tailwindcss " + packages.join(" ")

// print.spin("adding tailwindcss...");
await asyncLoader(system.run(install_packages_command), "adding tailwindcss");
await asyncLoader(system.run(packageExecCommand(packageManager)+" tailwindcss init -p"),"updating tailwindcss config");
await writeFileAsync("tailwind.config.js", react_vite_tailwind_config_template);
print.success("tailwindcss configured successfully");
return
} catch (error) {
//  print.error("error installing tailwind :"+error);
 process.exit(1);
}    
}
