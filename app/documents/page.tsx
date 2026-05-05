import { UserRole } from "@prisma/client"
import { requireSession } from "@/lib/auth/guards"
import { prisma } from "@/lib/prisma"
import { DocumentManager } from "@/components/features/document-manager"

export default async function DocumentsPage() {
  const session = await requireSession()
  const internalRoles: UserRole[] = [UserRole.ADMIN, UserRole.AVOCAT, UserRole.MANAGER]
  const isInternal = internalRoles.includes(session.user.role)

  const documents = await prisma.document.findMany({
    where: isInternal ? {} : { OR: [{ ownerId: session.user.id }, { company: { members: { some: { userId: session.user.id } } } }] },
    include: { owner: true, company: true },
    orderBy: { createdAt: "desc" }
  })

  const users = isInternal ? await prisma.user.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true } }) : []
  const companies = await prisma.company.findMany({
    where: isInternal ? {} : { members: { some: { userId: session.user.id } } },
    orderBy: { createdAt: "desc" }
  })

  return <DocumentManager documents={documents} users={users} companies={companies} canUploadForOthers={isInternal} />
}
