import { tailwind_base_css } from "@/commands/add/utils/consts";
import { tryCatchWrapper, readFileAsync, writeFileAsync } from "gluegun-toolbox";

export async function addBaseTWcss(inde_styles_path:string){
    tryCatchWrapper(
        async () => {
            const index_css = await readFileAsync(inde_styles_path)
            const new_base_css =  tailwind_base_css + index_css
            writeFileAsync(inde_styles_path, new_base_css)

        }
    )
}
