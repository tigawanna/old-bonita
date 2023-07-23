import { print} from "gluegun-toolbox"
import { getPackageManager, packageExecCommand } from "@/helpers/utils/get-package-manager.ts";
import { react_vite_tailwind_config_template, tw_vite_react_content } from "./tailwind-config-template.ts";
import { fileExists, writeFileAsync } from "@/helpers/toolbox/fs/crud-file.ts";


export async function installTWOnViteReact() {
try {  
const packageManager= await getPackageManager('./')    
const packages = ["tailwindcss","postcss", "autoprefixer"];      
const install_packages_command = packageManager + " install -D tailwindcss " + packages.join(" ")
await writeFileAsync("tailwind.config.js",react_vite_tailwind_config_template);


// print.spin("adding tailwindcss...");
// await system.run(install_packages_command);
// print.success("tailwindcss installed successfully");
// print.spin("updating tailwindcss config...");
// await system.run(packageExecCommand(packageManager)+" tailwindcss init -p");
// filesystem.appendAsync("tailwind.config.js",react_vite_tailwind_config_template);
// filesystem.writeAsync("tailwind.config.js",react_vite_tailwind_config_template);
// const cwd = filesystem.cwd()
// const path  = filesystem.path(cwd)

// const tw_config = await filesystem.readAsync("tailwind.config.js")

// print.info("path : "+path);
// print.info("current dir : "+cwd);
// const tw_config = await loadFile("./test.ts");
// print.info(tw_config);
// tw_config.exports.default.content.push(tw_vite_react_content)

// await writeFile(tw_config)
// print.success("tailwindcss configured successfully");

return
} catch (error) {
 print.error("error installing tailwind :"+error);
 process.exit(1);
}    
}
