import { getNpmPackageVersion } from "@/utils/helpers/pkg-manager/npm";
import { writeFile } from "fs/promises";
import Spinnies from "spinnies";

export async function updateDependancies() {
    const spinnies = new Spinnies()
  try {
     spinnies.add("main", { text: "checking latest deps" })
    const deps_file = await import("../../../../deps.json");
    const deps_json = deps_file.default;

    const deps_arr = Object.entries(deps_json).map(([name, version]) => {
      return getNpmPackageVersion(name, version);
    });

    const update = await (await Promise.allSettled(deps_arr))
    .reduce<{[key: string]: string}>((acc, res) => {
        if(res.status === "fulfilled" && res.value){
            if(res.value?.curr_version.includes("beta")){
              acc[res.value.name] = res.value.version.beta
            }else if(res.value?.curr_version.includes("alpha")){
              acc[res.value.name] = res.value.version?.alpha??res.value.curr_version
            }else{
             acc[res.value.name] = res.value?.version.latest
            }
        }
        return acc
    },{})
    spinnies.update("main", { text: "updating deps" })
    await writeFile("./deps.json", JSON.stringify(update, null, 2), "utf8");
    spinnies.succeed("main")
  } catch (error: any) {
    spinnies.fail("main", { text: error.message })
  }
}

// updateDependancies()
//   .then((data) => {
//     console.log("update deps retirn type", data);
//   })
//   .catch((error) => {
//     console.log("error getting package.json", error);
//   });
