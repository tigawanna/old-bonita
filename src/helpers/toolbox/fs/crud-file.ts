import { readFile,writeFile } from "fs/promises"
import { existsSync } from "fs"
import { tryCatchWrapper } from "../async/try-catch.ts"

/**
 * Reads a file asynchronously.
 *
 * @param {string} path - The path of the file to read.
 * @return {Promise<string>} A promise that resolves with the content of the file as a string.
 */
export async function readFileAsync(path: string) {
const [res,err] = await tryCatchWrapper(async () => await readFile(path, { encoding: "utf-8" }));
if(err) throw err;
return res
}

type PathFileType = Parameters<typeof writeFile>["0"]
type InputFileType = Parameters<typeof writeFile>["1"]
type WriteFileOptionsType = Parameters<typeof writeFile>["2"]

/**
 * Writes content to a file asynchronously or verwrite existing file.
 *
 * @param {PathFileType} path - The path of the file to write to.
 * @param {InputFileType} content - The content to write to the file.
 * @param {WriteFileOptionsType} [options] - The options for writing the file.
 * @return {Promise<any>} A promise that resolves with the result of the write operation.
 */
export async function writeFileAsync(path: PathFileType, content: InputFileType, _?: WriteFileOptionsType) {
const [res, err] = await tryCatchWrapper(async () => await writeFile(path, content,{ encoding: "utf-8" }));
    if (err) throw err;
    return res
}


export function fileExists(path:string) {
    return existsSync(path)
}
