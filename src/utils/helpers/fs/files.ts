import { readFile, writeFile } from "fs/promises";
import { printHelpers } from "../print-tools";
import { existsSync } from "fs";

/**
 * Writes or overwrites a file with the given content.
 *
 * @param {string} content - The content to be written to the file. Can be either a file path or a string.
 * @param {string} path - The path of the file to be written or overwritten.
 * @return {Promise<{success: boolean, operation: string}>} - A promise that resolves to an object indicating the success of the operation and the type of write operation performed.
 */
export async function writeOrOverWriteFile(content: string, path: string) {
  try {
    const is_file_path = existsSync(content);
    const write_content = is_file_path
      ? await readFile(content, "utf-8")
      : content;
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
