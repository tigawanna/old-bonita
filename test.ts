import { readFile, writeFile } from "fs/promises";
import { addVitePlugin } from "magicast/helpers";
import kleur from "kleur";
import { parseModule, generateCode, ImportItemInput,} from "magicast";

export async function addPandaScript() {
try{  
  //  const mod = parseModule(vite_config_file);
  // //  console.log("FS: vite config file ",kleur.green(vite_config_file));
  // const vite_config_magicats = mod
  // console.log("magicast ",vite_config_magicats);
  // return vite_config_magicats
  // const import_ite: ImportItemInput = { local:"tsconfigPaths",from:"vite-tsconfig-paths", imported:"default"}
  // const imports = mod.imports.$add(import_ite);
  // console.log("imports ",imports);
  
  
  const vite_config_file = await readFile("vite.config.js",{encoding:"utf-8"}); 
  const mod = parseModule(vite_config_file);

  
  console.log("rest ",);
  // addVitePlugin(mod, {
  //   from: "vite-tsconfig-paths",
  //   constructor: "tsconfigPaths",
  //   imported: "default",
  //  });
  const { code, map } = generateCode(mod);
  // await writeFile("vite.config.js", code, {
  //   encoding: "utf-8",
  // })
  console.log("code: ",kleur.cyan(code));
  // console.log("map: ",map);
}
catch(error:any){

  throw error.message
}
}




addPandaScript()
  .then((res) => {
    // console.log(kleur.cyan("done"),kleur.green(res));
    // console.log("res")
  })
  .catch((err) => {
    console.error(kleur.red("error"), err);
  });
