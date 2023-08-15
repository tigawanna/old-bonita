import { boolean } from "prask";
import Spinnies from "spinnies";
import { installPackages } from "../pkg-manager/package-managers";

export async function promptToInstall(){
    const spinnies = new Spinnies()
try {
    const consent = await boolean({
        message: "Do you want to install the dependancies now ?",
        initial: true,
    })
    if (!consent) {
        return
    }
    spinnies.add("fetching", { text: "installing dependancies" })
    await installPackages([""]);
    spinnies.succeed("fetching")
} catch (error:any) {
    spinnies.fail("fetching", { text: error.message })
    return
}
}
