import { printHelpers } from "@/utils/helpers/print-tools";
import { existsSync } from "fs";
import { readFile, writeFile} from "fs/promises";
import { cloneRepository} from "@/utils/helpers/repos/get-repo";
import { mergeOrCreateDirs} from "@/utils/helpers/fs/directories";
import { writeOrOverWriteFile } from "@/utils/helpers/fs/files";
import { TBonitaConfigSchema } from "@/utils/config/config";
import { destr } from "destr";
import { IPackageJson } from "@/utils/helpers/types";
import {merge} from "remeda"
import { loader } from "@/utils/helpers/loader-tools";


export async function setUpRouterTemplate(config: TBonitaConfigSchema) {
  const add_tanstck_spinners = await loader("adding tanstack templates");
  try {
  if(!existsSync("./temp")){
    await getPagesTemplateDirectory();
}
 const res = await addteTemplateFiles(config)
  await mergePackageJSON();
  printHelpers.success("setup complete");
  add_tanstck_spinners.succeed();

  return res
  } catch (error: any) {
    add_tanstck_spinners.failed();
    throw new Error( error.message);
  }
}




export async function addteTemplateFiles(config: TBonitaConfigSchema) {
  try {
  await mergeOrCreateDirs("./temp/src/pages",config.vite_tanstack?.pages_dir_path??"./src/pages");
   await mergeOrCreateDirs("./temp/src/state", config.state);
    await mergeOrCreateDirs("./temp/src/components",config.components);
   await writeOrOverWriteFile("./temp/src/main.tsx", config.vite_tanstack?.src_root_path??"./src/main.tsx");
    await writeOrOverWriteFile("./temp/src/App.tsx", config.vite_tanstack?.src_app_path??"./src/App.tsx");

    return "templates added"

  } catch (error:any) {
    printHelpers.error("error getting pages template " + error.message);
    throw error
  }
}




export async function getPagesTemplateDirectory() {
  try {
    const template_dir = await cloneRepository(
      "https://github.com/tigawanna/tanstack-router-vite-react",
      "./temp",
    )
    printHelpers.success("template dir cloned successfully");
    return template_dir
  } catch (error:any) {
    printHelpers.error("error cloning repository " + error.message);
    throw error
  }
}


export async function mergePackageJSON(){
  try {
    const temp_pkg_json = destr <IPackageJson> (await readFile("./temp/package.json", "utf-8"));
    const project_pkg_json = destr <IPackageJson>(await readFile("./package.json", "utf-8"));
    const new_pkg_json = merge(project_pkg_json,temp_pkg_json,);
    await writeFile("./package.json", JSON.stringify(new_pkg_json),{encoding:"utf-8"});
    return new_pkg_json
  } catch (error:any) {
    printHelpers.error("error merging package jsons " + error.message);
    throw error
    
  }
}

// setUpPagesTemplate()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
