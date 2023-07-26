import { statSync } from "fs"
import {TFrameworkType,fileExists,supportedFrameworks as toolbox_supprtedFrameworks} from "gluegun-toolbox"

export type TSupprtedFrameworks = TFrameworkType
export const supportedFrameworks = toolbox_supprtedFrameworks.filter((framework) => framework !== "Others")

const frames:TSupprtedFrameworks ="Nextjs"
export function frameworkDefaults(framework: TSupprtedFrameworks){
if(framework === "Nextjs"){
    if(fileExists("./src")){
        if (fileExists("./src/app/globals.css")) {
            return {
                root_dir: "./src/app",
                root_styles: "./src/app/globals.css",
                framework: "Nextjs",
                tailwind: {
                    tw_config: "tailwind.config.js",
                    tw_plugins: [],
                },
            }
        }
        if (fileExists("./src/pages/globals.css")) {
            return {
                root_dir: "./src/pages",
                root_styles: "./src/pages/globals.css",
                framework: "Nextjs",
                tailwind: {
                    tw_config: "tailwind.config.js",
                    tw_plugins: [],
                },
            }
        }
    }
    if (fileExists("./app/globals.css")) {
        return {
            root_dir: "./app",
            root_styles: "./app/globals.css",
            framework: "Nextjs",
            tailwind: {
                tw_config: "tailwind.config.js",
                tw_plugins: [],
            },
        }
    }
    if (fileExists("./pages/globals.css")) {
        return {
            root_dir: "./pages",
            root_styles: "./pages/globals.css",
            framework: "Nextjs",
            tailwind: {
                tw_config: "tailwind.config.js",
                tw_plugins: [],
            },
        }
    }

    return {
        root_dir: "./",
        root_styles: "./globals.css",
        framework: "Nextjs",
        tailwind: {
            tw_config: "tailwind.config.js",
            tw_plugins: [],
        },
    }

}
    return {
        root_dir: "./src",
        root_styles: "./src/index.css",
        framework,
        tailwind: {
            tw_config: "tailwind.config.js",
            tw_plugins: [],
        },
    }

}
