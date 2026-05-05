"use server"

import { UserRole } from "@prisma/client"
import { requireRoles } from "@/lib/auth/guards"
import { prisma } from "@/lib/prisma"
import { invoiceSchema } from "@/lib/security/schemas"

export async function createInvoice(input: unknown) {
  await requireRoles([UserRole.ADMIN, UserRole.MANAGER])
  const parsed = invoiceSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, message: "La facture contient des champs invalides." }
  }

  if (!parsed.data.clientId && !parsed.data.companyId) {
    return { ok: false, message: "La facture doit être liée à un client ou une entreprise." }
  }

  await prisma.invoice.create({
    data: {
      label: parsed.data.label,
      amountCents: parsed.data.amountCents,
      dueDate: new Date(parsed.data.dueDate),
      status: parsed.data.status,
      clientId: parsed.data.clientId,
      companyId: parsed.data.companyId
    }
  })

  return { ok: true, message: "Facture créée." }
}
