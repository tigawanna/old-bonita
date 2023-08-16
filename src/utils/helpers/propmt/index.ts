import { boolean } from "prask";
import { installPackages } from "../pkg-manager/package-managers";
import { TAddOptions } from "@/commands/add/args";

export async function promptToInstall(options?:TAddOptions){

try {
    if(!options?.yes){
        const consent = await boolean({
            message: "Do you want to install the dependencies now ?",
            initial: true,
        })??true
        if (!consent) {
            return
        }
    }
  
    await installPackages([""]);

} catch (error:any) {
    return
}
}
