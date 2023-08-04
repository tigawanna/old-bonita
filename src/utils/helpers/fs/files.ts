import { readFile, writeFile } from "fs/promises";
import { printHelpers } from "../print-tools";
import { existsSync } from "fs";
import fsextra from "fs-extra";
/**
 * Writes or overwrites a file with the given content.
 *
 * @param {string} content - The content to be written to the file. Can be either a file path or a string.
 * @param {string} path - The path of the file to be written or overwritten.
 * @return {Promise<{success: boolean, operation: string}>} - A promise that resolves to an object indicating the success of the operation and the type of write operation performed.
 */
export async function writeOrOverWriteFile(path: string, content: string) {
  // printHelpers.info(path , content);
  // printHelpers.info("content " + content);
  try {
    const is_file_path = existsSync(path);
    // printHelpers.info("writing file " + path);
    if (!is_file_path) {
      // printHelpers.warning("creating file " + path);
      await fsextra.ensureFile(path);
      await writeFile(path, content, { flag: "wx", encoding: "utf-8" }).catch((error: any) => {
        printHelpers.error("error writing file " + error.message);
        // throw error;
      });
      return {
        success: true,
        operation: "create file",
      };
    }
    const write_content = await readFile(content, "utf-8");
    await writeFile(path, write_content);
    // printHelpers.success("file written successfully");
    return {
      success: true,
      operation: is_file_path ? "write file contents" : "write string value",
    };
  } catch (error: any) {
    printHelpers.error("error writing file " + error.message);
    throw error;
  }
}

/**
 * Checks if any of the given paths exist.
 *
 * @param {string[]} possible_paths - An array of paths to check.
 * @returns {string | null} - The first existing path, or null if none exist.
 */
export function pathExists(possible_paths: string[]) {
  try {
    for (const path_name of possible_paths) {
      if (existsSync(path_name)) {
        return path_name;
      }
    }
    return null;
  } catch (error: any) {
    throw error.message;
  }
}
