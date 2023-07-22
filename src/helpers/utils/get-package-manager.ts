import { detect } from "@antfu/ni"

export async function getPackageManager(
  targetDir: string
): Promise<"yarn" | "pnpm" | "bun" | "npm"> {
  const packageManager = await detect({ programmatic: true, cwd: targetDir })

  if (packageManager === "yarn@berry") return "yarn"
  if (packageManager === "pnpm@6") return "pnpm"
  if (packageManager === "bun") return "bun"

  return packageManager ?? "npm"
}


export function packageExecCommand(packageManager: "yarn" | "pnpm" | "bun" | "npm") {
  switch (packageManager) {
    case "yarn":
      return "yarn"
    case "pnpm":
      return "pnpm dlx"
    case "bun":
      return "bux"
    case "npm":
      return "npx"
  }
}
