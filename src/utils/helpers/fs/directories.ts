import { cp, readdir, rm } from "fs/promises";
import AdmZip from "adm-zip";
import { existsSync } from "fs";
import { printHelpers } from "../print-tools";

export async function readDirectories(directoryPath: string) {
  try {
    const files = await readdir(directoryPath, { withFileTypes: true });
    const directories = files.filter((file) => file.isDirectory()).map((file) => file.name);
    return directories;
  } catch (err) {
    console.log("Error reading directories:", err);
    throw err;
  }
}

export function unzipFile(zipFilePath: string, outputPath: string) {
  try {
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(outputPath, true);
    console.log("File unzipped successfully");
  } catch (error) {
    console.error("Error unzipping file:", error);
    throw error;
  }
}

export async function removeDirectory(directoryPath: string) {
  try {
    await rm(directoryPath, { recursive: true });
    console.log(directoryPath + " removed successfully");
  } catch (error) {
    console.error(`Error removing ${directoryPath} directory:`, error);
    throw error;
  }
}

export async function mergeOrCreateDirs(originPath: string,destinationPath: string) {
  try {
    const origin_pages_dirs = await readDirectories(originPath);
    if (existsSync(destinationPath)) {
      printHelpers.warning("Directory exists, merging files");
      const target_pages_dirs = await readDirectories(destinationPath);
      const pages_dirs_to_write = origin_pages_dirs.filter(
        (item) => !target_pages_dirs.includes(item)
      );

      await Promise.all(
        pages_dirs_to_write.map(async (pageDir) => {
          if (!target_pages_dirs.includes(pageDir)) {
            await cp(`${originPath}/${pageDir}`, `${destinationPath}/${pageDir}`, {
              recursive: true,
            });
          }
        })
      );

      printHelpers.success("Files merged successfully");
      return {
        success: true,
        operation: "merge",
        files: {
          existing: target_pages_dirs,
          incoming: origin_pages_dirs,
          diff: pages_dirs_to_write,
        },
      };
    } else {
      printHelpers.warning("Directory doesn't exist, creating new");
      await cp(originPath, destinationPath, {
        recursive: true,
      });
      printHelpers.success("Directory created successfully");
      return {
        success: true,
        operation: "create",
        files: {
          existing: [],
          incoming: origin_pages_dirs,
          diff: [],
        },
      };
    }
  } catch (error: any) {
    printHelpers.error("Error:", error.message);
    throw error;
  }
}
