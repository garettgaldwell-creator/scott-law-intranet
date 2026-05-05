import { describe, expect, it } from "vitest"
import { invoiceSchema, recruitmentSchema } from "@/lib/security/schemas"

describe("schemas", () => {
  it("valide une candidature accentuée", () => {
    const result = recruitmentSchema.safeParse({
      firstName: "Émile",
      lastName: "Durand",
      email: "emile@example.com",
      discordUsername: "Émile#0001",
      motivation: "Je souhaite rejoindre le cabinet pour accompagner les clients avec rigueur."
    })
    expect(result.success).toBe(true)
  })

  it("refuse une facture sans montant positif", () => {
    const result = invoiceSchema.safeParse({
      label: "Consultation",
      amountCents: 0,
      dueDate: new Date().toISOString(),
      status: "IMPAYEE",
      clientId: undefined,
      companyId: undefined
    })
    expect(result.success).toBe(false)
  })
})
