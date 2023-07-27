import { readFile } from "fs";
import { destr } from "destr";
import { IPackageJson } from "./src/utils/helpers/types";
import { print } from "gluegun-toolbox";
import { writeFile } from "fs/promises";
import { execa } from 'execa';

export async function addPandaScript() {
//   readFile("./package.json", "utf-8", (err, data) => {
//     if (data) {
//       const pkg_json = destr<IPackageJson>(data);
//       pkg_json.scripts["prepare"] = "panda codegen";
//       const new_pkg_json = JSON.stringify(pkg_json, null, 2);
//         writeFile("./package.json", new_pkg_json, { encoding: "utf-8" })
//         .then((res) => {
//           return res;
//         })
//         .catch((err) => {
//           print.debug(err, "error saving pkg json");
//           throw err;
//         });
//     }
//   });
   return  await execa("pnpm", ["install", "-D","@pandacss/dev"])
}

addPandaScript()
  .then((res) => {
    console.log("done", res);
  })
  .catch((err) => {
    console.log("error", err);
  });
