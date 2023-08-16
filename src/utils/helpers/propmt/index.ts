import { boolean } from "prask";
import Spinnies from "spinnies";
import { installPackages } from "../pkg-manager/package-managers";

export async function promptToInstall(){
    const spinnies = new Spinnies()
try {
    const consent = await boolean({
        message: "Do you want to install the dependencies now ?",
        initial: true,
    })??true
    if (!consent) {
        return
    }
    spinnies.add("fetching", { text: "installing dependencies" })
    await installPackages([""]);
    spinnies.succeed("fetching")
} catch (error:any) {
    spinnies.fail("fetching", { text: error.message })
    return
}
}
