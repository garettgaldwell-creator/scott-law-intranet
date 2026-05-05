import { UserRole } from "@prisma/client"
import { requireRoles } from "@/lib/auth/guards"
import { prisma } from "@/lib/prisma"
import { KnowledgeManager } from "@/components/features/knowledge-manager"

export default async function KnowledgePage() {
  await requireRoles([UserRole.ADMIN, UserRole.AVOCAT, UserRole.MANAGER])

  const categories = await prisma.knowledgeCategory.findMany({
    include: { articles: { include: { author: true }, orderBy: { createdAt: "desc" } } },
    orderBy: { name: "asc" }
  })

  return <KnowledgeManager categories={categories} />
}
