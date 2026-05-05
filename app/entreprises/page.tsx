import { UserRole } from "@prisma/client"
import { requireSession } from "@/lib/auth/guards"
import { prisma } from "@/lib/prisma"
import { CompanyManager } from "@/components/features/company-manager"

export default async function CompaniesPage() {
  const session = await requireSession()
  const isInternal = [UserRole.ADMIN, UserRole.AVOCAT, UserRole.MANAGER].includes(session.user.role)

  const companies = await prisma.company.findMany({
    where: isInternal ? {} : { members: { some: { userId: session.user.id } } },
    include: {
      members: { include: { user: true } },
      cases: true,
      documents: true
    },
    orderBy: { createdAt: "desc" }
  })

  const users = isInternal
    ? await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true }
      })
    : []

  return <CompanyManager companies={companies} users={users} canManage={isInternal} />
}
