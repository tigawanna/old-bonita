import { TBonitaConfigSchema} from "@/utils/config/config";
import { getPackageManager } from "@/utils/helpers/get-package-manager";
import { loader, system, print, writeFileAsync } from "gluegun-toolbox";
import { addBaseTWcss } from "@/utils/installers/tailwind/addBaseCss";
import { validateRelativePath } from "@/utils/helpers/general";
import { promptForPandaConfig } from "./prompts";
import { z } from "zod";
import { addPandaScript, panda_base_css, panda_config_template } from "./templates";


// Define the tailwind schema
export const pandaSchema = z.object({
  panda_config_path: z.string().default("panda.config.ts"),
  // tw_plugins: z.array(z.string()).default([]),
})

export type TPandaConfigSchema = z.infer<typeof pandaSchema>;

export async function installPanda(bonita_config: TBonitaConfigSchema) {
  try {
    const config = await promptForPandaConfig(bonita_config);
  
    const root_styles = validateRelativePath(config.root_styles);
    const panda_config_path = validateRelativePath(config.panda.panda_config_path);
    const framework = config.framework;

    const tw_plugins = config.tailwind?.tw_plugins;
    const packageManager = await getPackageManager("./");
    
    const install_packages_command =packageManager +" install -D @pandacss/dev postcss"
    
    const installing_pkgs_spinners = await loader("installing pandacss dependancies");
    await system.run(install_packages_command)
    .then(() => {
      installing_pkgs_spinners.succeed();
    })
    .catch((error) => {
      print.error("Error installing pandacss dependancies  :\n" + error.message);
      print.info("try instalig them manually and try again");
      print.info(install_packages_command);
      installing_pkgs_spinners.failed();
      process.exit(1);
    });
    
    const init_tw_spinners = await loader(packageManager + " panda init --postcss");
    await system.run(packageManager + " panda init --postcss")
    .then(() => {
      init_tw_spinners.succeed();
    })
    .catch((error) => {
      print.error("Error initializing pandacss  :\n" + error.message);
      print.info("try running it namually");
      print.info(packageManager + " panda init --postcss");
      installing_pkgs_spinners.failed();
      process.exit(1);
    });

    
    const add_panda_script_spinners = await loader("adding panda prepare script");
    addPandaScript().then(() => {
      add_panda_script_spinners.succeed()

    }).catch((error) => {
      print.error("Error adding panda prepare script  :\n" + error.message);
      print.info("try instalig them manually into the package.json scripts");
      print.info(`"prepare": "panda codegen"`);
      add_panda_script_spinners.failed();
      process.exit(1);
    })
  

    const panda_config_spinners = await loader("adding panda configs");

      await writeFileAsync(panda_config_path,panda_config_template)
          .then((res) => {
              panda_config_spinners.succeed();
              return res
          })
      .catch(
        (error) => {
          print.error("Error adding tw config  :\n" + error.message);
          print.info("try instalig them manually and try again");
          print.info(panda_config_template);
          panda_config_spinners.failed();
          process.exit(1);
        }
      );
    
   

    // add base styles into root css file
    // print.debug({framework,root_styles},"adding base styles into root css file");
    const base_styles_spinner = await loader("adding base styles");
    if (framework === "React+Vite") {
      await addBaseTWcss(root_styles)
          .then((res) => {
              base_styles_spinner.succeed();
              print.success("added base styles");
              return res
          })
      .catch((error) => {
        print.error("Error adding base styles in app dir :\n" + error.message);
        print.info("try adding manually and try again");
        print.info(panda_base_css);
        base_styles_spinner.failed();
        process.exit(1);
      })
    }
    if (framework === "Rakkasjs") {
      await addBaseTWcss(root_styles)
          .then((res) => {
              base_styles_spinner.succeed();
              print.success("added base styles");
              return res
          })
      .catch((error) => {
        print.error("Error adding base styles  :\n" + error.message);
        print.info("try adding manually and try again");
        print.info(panda_base_css);
        base_styles_spinner.failed();
        process.exit(1);
      })
    }
    if (framework === "Nextjs") {
        // print.debug({framework,root_styles},"adding base styles into root css file");
        // print.info("adding base styles into" + root_dir ?? "./src/index.css");
       await addBaseTWcss(root_styles)
        .then((res) => {
               base_styles_spinner.succeed();
            print.success("added base styles");
               return res
        })
       .catch((error) => {
           print.error("Error adding base styles :\n" + error.message);
           print.info("try adding manually and try again");
           print.info(panda_base_css);
           base_styles_spinner.failed();
           process.exit(1);
       })

    }
      base_styles_spinner.succeed()



  } catch (error:any) {
    print.error("Error installing pandacss  :\n" + error.message);
    process.exit(1);
  }
}
