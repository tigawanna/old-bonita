import { installTWOnViteReact } from "./react/vite-react.ts";
import { print} from "gluegun-toolbox"
const tailwind_installers_map = {
    "react":installTWOnViteReact ,
}

export async function installTailwind(framework:"react") {
try {
return await tailwind_installers_map[framework]();
} catch (error) {
    print.error("error installing tailwind :" + error);
    process.exit(1);

}
}
