"use server"

import { UserRole } from "@prisma/client"
import { requireRoles } from "@/lib/auth/guards"
import { prisma } from "@/lib/prisma"
import { companyMemberSchema, companySchema } from "@/lib/security/schemas"

export async function saveCompany(input: unknown) {
  await requireRoles([UserRole.ADMIN, UserRole.AVOCAT, UserRole.MANAGER])
  const parsed = companySchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, message: "Les informations de l’entreprise sont invalides." }
  }

  if (parsed.data.id) {
    await prisma.company.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        registrationNumber: parsed.data.registrationNumber || null,
        notes: parsed.data.notes || null
      }
    })
    return { ok: true, message: "Entreprise mise à jour." }
  }

  await prisma.company.create({
    data: {
      name: parsed.data.name,
      registrationNumber: parsed.data.registrationNumber || null,
      notes: parsed.data.notes || null
    }
  })

  return { ok: true, message: "Entreprise créée." }
}

export async function attachUserToCompany(input: unknown) {
  await requireRoles([UserRole.ADMIN, UserRole.AVOCAT, UserRole.MANAGER])
  const parsed = companyMemberSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, message: "Association invalide." }
  }

  await prisma.companyMember.upsert({
    where: {
      userId_companyId: {
        userId: parsed.data.userId,
        companyId: parsed.data.companyId
      }
    },
    update: {},
    create: parsed.data
  })

  return { ok: true, message: "Utilisateur associé à l’entreprise." }
}
