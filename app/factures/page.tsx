import { UserRole } from "@prisma/client"
import { requireSession } from "@/lib/auth/guards"
import { prisma } from "@/lib/prisma"
import { InvoiceManager } from "@/components/features/invoice-manager"

export default async function InvoicesPage() {
  const session = await requireSession()
  const canManage = [UserRole.ADMIN, UserRole.MANAGER].includes(session.user.role)

  const invoices = await prisma.invoice.findMany({
    where: canManage ? {} : { OR: [{ clientId: session.user.id }, { company: { members: { some: { userId: session.user.id } } } }] },
    include: { client: true, company: true },
    orderBy: { createdAt: "desc" }
  })

  const users = canManage ? await prisma.user.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true } }) : []
  const companies = canManage ? await prisma.company.findMany({ orderBy: { createdAt: "desc" } }) : []

  return <InvoiceManager invoices={invoices} users={users} companies={companies} canManage={canManage} />
}
