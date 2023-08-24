import { existsSync } from "fs";
import { TFrameworkType, supportedFrameworks } from "./whatFramework";

export type TSupprtedFrameworks = TFrameworkType;
export const supportedFrameworklist = supportedFrameworks.filter(
  (framework) => framework !== "Others",
);

const frames: TSupprtedFrameworks = "Nextjs";
export function frameworkDefaults(framework: TSupprtedFrameworks) {
  if (framework === "Nextjs") {
    if (existsSync("./src")) {
      //src app dir
      if (existsSync("./src/app/globals.css")) {
        return {
          root_dir: "./src/app",
          state: "./src/state",
          components: "./src/components",
          root_styles: "./src/app/globals.css",
          framework: "Nextjs",
          tailwind: {
            tw_config: "tailwind.config.js",
            tw_plugins: [],
          },
        };
      }
      //src  pages dir
      if (existsSync("./src/pages")&&existsSync("./src/styles/globals.css")) {
        return {
          root_dir: "./src/pages",
          root_styles: "./src/styles/globals.css",
          state: "./src/state",
          components: "./src/components",
          framework: "Nextjs",
          tailwind: {
            tw_config: "tailwind.config.js",
            tw_plugins: [],
          },
        };
      }
    }
    //no src app dir
    if (existsSync("./app") &&existsSync("./app/globals.css")) {
      return {
        root_dir: "./app",
        root_styles: "./app/globals.css",
        state: "./state",
        components: "./components",
        framework: "Nextjs",
        tailwind: {
          tw_config: "tailwind.config.js",
          tw_plugins: [],
        },
      };
    }
    //no src pages dir 
    if (existsSync("./pages/styles/globals.css")) {
      return {
        root_dir: "./pages",
        root_styles: "./pages/styles/globals.css",
        state: "./state",
        components: "./components",
        framework: "Nextjs",
        tailwind: {
          tw_config: "tailwind.config.js",
          tw_plugins: [],
        },
      };
    }
    // default case
    return {
      root_dir: "./",
      root_styles: "./styles/globals.css",
      state: "./state",
      components: "./components",
      framework: "Nextjs",
      tailwind: {
        tw_config: "tailwind.config.js",
        tw_plugins: [],
      },
    };
  }
  if (framework === "RedWood") {
    return {
      root_dir: "./web/src",
      root_styles: "./web/src/index.css",
      state: "./web/src/state",
      components: "./web/src/components",
      framework: "RedWood",
      tailwind: {
        tw_config: "./web/tailwind.config.js",
        tw_plugins: [],
      },
    };
  }
  return {
    root_dir: "./src",
    root_styles: "./src/index.css",
    state: "./src/state",
    components: "./src/components",
    framework,
    tailwind: {
      tw_config: "tailwind.config.js",
      tw_plugins: [],
    },
  };
}
