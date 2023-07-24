import { tryCatchWrapper } from "@/helpers/toolbox/async/try-catch.ts";
import { readFileAsync, writeFileAsync } from "@/helpers/toolbox/fs/crud-file.ts";
import { tailwind_base_css } from "./tailwind-config-template.ts";


export async function addBaseTWcss(inde_styles_path:string){
    tryCatchWrapper(
        async () => {
            const index_css = await readFileAsync(inde_styles_path)
            const new_base_css =  tailwind_base_css + index_css
            writeFileAsync(inde_styles_path, new_base_css)

        }
    )
}
