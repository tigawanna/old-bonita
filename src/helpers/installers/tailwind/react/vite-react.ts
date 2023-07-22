import { print,system } from "gluegun"
import { getPackageManager, packageExecCommand } from "@/helpers/utils/get-package-manager.ts";


export async function installTWOnViteReact() {
try {  
const packageManager= await getPackageManager('./')    
const packages = ["tailwindcss","postcss", "autoprefixer"];      
const install_packages_command = packageManager + " install -D tailwindcss " + packages.join(" ")
print.spin("adding tailwindcss...");
await system.run(install_packages_command);
await system.run(packageExecCommand(packageManager)+" tailwindcss init -p");
print.success("tailwindcss installed successfully");
return
} catch (error) {
 print.error("error installing tailwind :"+error);
 process.exit(1);
}    
}
