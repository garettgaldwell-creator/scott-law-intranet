"use server"

import { UserRole } from "@prisma/client"
import { requireRoles } from "@/lib/auth/guards"
import { prisma } from "@/lib/prisma"
import { knowledgeArticleSchema, knowledgeCategorySchema } from "@/lib/security/schemas"

export async function createKnowledgeCategory(input: unknown) {
  await requireRoles([UserRole.ADMIN, UserRole.AVOCAT, UserRole.MANAGER])
  const parsed = knowledgeCategorySchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, message: "La catégorie est invalide." }
  }

  await prisma.knowledgeCategory.upsert({
    where: { name: parsed.data.name },
    update: {},
    create: parsed.data
  })

  return { ok: true, message: "Catégorie créée." }
}

export async function createKnowledgeArticle(input: unknown) {
  const session = await requireRoles([UserRole.ADMIN, UserRole.AVOCAT, UserRole.MANAGER])
  const parsed = knowledgeArticleSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, message: "L’article est invalide." }
  }

  await prisma.knowledgeArticle.create({
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      categoryId: parsed.data.categoryId,
      authorId: session.user.id
    }
  })

  return { ok: true, message: "Article publié." }
}
