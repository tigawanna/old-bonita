import { IFrameworkType } from "gluegun-toolbox";

export type TSupportedFrameworks = "React+Vite" | "Nextjs";

type TFrameworkMap = {
    [key in IFrameworkType]: () => Promise<void>;
}
export type FrameworkInstallerObject = Pick<TFrameworkMap, "React+Vite" | "Nextjs">;
