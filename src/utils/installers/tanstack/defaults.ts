import { checkFramework } from "@/utils/helpers/framework/whatFramework"
import { getPkgJson } from "@/utils/helpers/pkg-json"

export async function defaultDirPaths(){
try {
const framewokr = await checkFramework()
if(framewokr==="React+Vite"){
    
}

} catch (error) {
    
}    
}
