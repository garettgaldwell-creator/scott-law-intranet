"use server"

import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/security/rate-limit"
import { recruitmentSchema } from "@/lib/security/schemas"

export async function submitRecruitmentApplication(input: unknown) {
  const parsed = recruitmentSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, message: "La candidature contient des champs invalides." }
  }

  const limited = rateLimit(`recruitment:${parsed.data.email}`, 3, 60 * 60 * 1000)

  if (!limited.ok) {
    return { ok: false, message: "Trop de candidatures envoyées. Réessaie plus tard." }
  }

  await prisma.recruitmentApplication.create({
    data: parsed.data
  })

  return { ok: true, message: "Candidature envoyée avec succès." }
}
