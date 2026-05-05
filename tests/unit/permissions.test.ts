import { describe, expect, it } from "vitest"
import { canAccessPath, hasAnyRole } from "@/lib/auth/permissions"

describe("permissions", () => {
  it("autorise les rôles internes à consulter la base de connaissances", () => {
    expect(canAccessPath("ADMIN", "/base-connaissances")).toBe(true)
    expect(canAccessPath("AVOCAT", "/base-connaissances/articles")).toBe(true)
    expect(canAccessPath("MANAGER", "/base-connaissances")).toBe(true)
  })

  it("refuse la base de connaissances aux clients", () => {
    expect(canAccessPath("CLIENT", "/base-connaissances")).toBe(false)
  })

  it("vérifie les ensembles de rôles", () => {
    expect(hasAnyRole("ADMIN", ["ADMIN", "MANAGER"])).toBe(true)
    expect(hasAnyRole("CLIENT", ["ADMIN", "MANAGER"])).toBe(false)
  })
})
