import { printHelpers } from "@/utils/helpers/print-tools"
import { loadFile } from "magicast"
import { getDefaultExportOptions } from "magicast/helpers"

export async function manipulateWeithMagicast(){
try {
 const mod = await loadFile('./src/play/config.ts') 
const imports = mod.imports 
const body = mod.$ast.start
 printHelpers.stringify(body) 
} catch (error) {
    
}
}

manipulateWeithMagicast().catch(err=>{
    printHelpers.error(err)
})
