import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const root = process.cwd()
const codeExtensions = [".ts", ".tsx", ".mjs", ".css", ".prisma"]
const forbiddenPatterns = [new RegExp("<" + "form", "i"), new RegExp("window\\." + "alert"), new RegExp("window\\." + "confirm"), new RegExp("window\\." + "prompt")]

function collectFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const absolutePath = join(directory, entry)
    const stats = statSync(absolutePath)
    if (stats.isDirectory() && !["node_modules", ".next"].includes(entry)) {
      return collectFiles(absolutePath)
    }
    return stats.isFile() ? [absolutePath] : []
  })
}

describe("règles projet", () => {
  it("ne contient aucune balise ou API interdite", () => {
    const files = collectFiles(root).filter((file) => codeExtensions.some((extension) => file.endsWith(extension)))
    const violations = files.flatMap((file) => {
      const content = readFileSync(file, "utf8")
      return forbiddenPatterns.filter((pattern) => pattern.test(content)).map((pattern) => `${file}:${pattern}`)
    })
    expect(violations).toEqual([])
  })
})
