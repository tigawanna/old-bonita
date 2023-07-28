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
      if (existsSync("./src/app/globals.css")) {
        return {
          root_dir: "./src/app",
          root_styles: "./src/app/globals.css",
          framework: "Nextjs",
          tailwind: {
            tw_config: "tailwind.config.js",
            tw_plugins: [],
          },
        };
      }
      if (existsSync("./src/pages/globals.css")) {
        return {
          root_dir: "./src/pages",
          root_styles: "./src/pages/globals.css",
          framework: "Nextjs",
          tailwind: {
            tw_config: "tailwind.config.js",
            tw_plugins: [],
          },
        };
      }
    }
    if (existsSync("./app/globals.css")) {
      return {
        root_dir: "./app",
        root_styles: "./app/globals.css",
        framework: "Nextjs",
        tailwind: {
          tw_config: "tailwind.config.js",
          tw_plugins: [],
        },
      };
    }
    if (existsSync("./pages/globals.css")) {
      return {
        root_dir: "./pages",
        root_styles: "./pages/globals.css",
        framework: "Nextjs",
        tailwind: {
          tw_config: "tailwind.config.js",
          tw_plugins: [],
        },
      };
    }

    return {
      root_dir: "./",
      root_styles: "./globals.css",
      framework: "Nextjs",
      tailwind: {
        tw_config: "tailwind.config.js",
        tw_plugins: [],
      },
    };
  }
  return {
    root_dir: "./src",
    root_styles: "./src/index.css",
    framework,
    tailwind: {
      tw_config: "tailwind.config.js",
      tw_plugins: [],
    },
  };
}
