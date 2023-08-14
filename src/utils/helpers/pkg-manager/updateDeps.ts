import { getNpmPackageVersion } from "@/utils/helpers/pkg-manager/npm";
import { writeFile } from "fs/promises";
import Spinnies from "spinnies";



export async function updateInnerDeps(name:string,deps_json:{[key:string]:string}) {
  const spinnies = new Spinnies()
  try {
    spinnies.add("main", { text: `checking ${name} deps` })
      const deps_arr = Object.entries(deps_json).map(([name, version]) => {
      return getNpmPackageVersion(name, version);
    });

    const updated_deps = await (await Promise.allSettled(deps_arr))
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
    spinnies.succeed("main")
    const deps = {}
    // @ts-expect-error
      deps[name] = updated_deps
    return deps
  }catch (error: any) {
    spinnies.fail("main", { text: error.message })
  }
}

export async function updateDependancies() {
    const spinnies = new Spinnies()
  try {
     spinnies.add("main", { text: "checking latest deps" })
    const deps_file = await import("../../../../deps.json");
    const deps_json = deps_file.default;
  

    const updates = Object.entries(deps_json).map(([k,v]) => {
     return  updateInnerDeps(k,v)
    })

    const new_deps = await (await Promise.allSettled(updates))
    .reduce<{[key: string]: string}>((acc, res) => {
        if(res.status === "fulfilled" && res.value){
          return {...acc,...res.value}
        }
        return acc
    },{})
   


    spinnies.update("main", { text: "updating deps" })
    await writeFile("./deps.json", JSON.stringify(new_deps, null, 2), "utf8");
    spinnies.succeed("main")
  } catch (error: any) {
    spinnies.fail("main", { text: error.message })
  }
}

updateDependancies()
  .then((data) => {
    console.log("update deps retirn type", data);
  })
  .catch((error) => {
    console.log("error getting package.json", error);
  });

// {

//     "autoprefixer": "^10.4.14",
//     "daisyui": "^3.5.0",
//     "postcss": "^8.4.27",
//     "tailwind-scrollbar": "^3.0.4",
//     "tailwindcss": "^3.3.3",
//     "tailwindcss-animate": "^1.0.6",
//     "tailwindcss-elevation": "^2.0.0",
//     "@pandacss/dev": "^0.11.0",
//     "@tanstack/eslint-plugin-query": "5.0.0-beta.5",
//     "@tanstack/react-query-devtools": "5.0.0-beta.7",
//     "@tanstack/router-devtools": "0.0.1-beta.121",
//     "@tanstack/react-query": "5.0.0-beta.7",
//     "@tanstack/router": "0.0.1-beta.121"
  
// }
