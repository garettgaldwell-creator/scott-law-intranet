import { UserRole } from "@prisma/client"
import { requireSession } from "@/lib/auth/guards"
import { prisma } from "@/lib/prisma"
import { AppointmentManager } from "@/components/features/appointment-manager"

export default async function AppointmentsPage() {
  const session = await requireSession()
  const internalRoles: UserRole[] = [UserRole.ADMIN, UserRole.AVOCAT]
  const isInternal = internalRoles.includes(session.user.role)

  const slots = await prisma.appointmentSlot.findMany({
    where: isInternal ? {} : { appointment: null, startsAt: { gte: new Date() } },
    include: { lawyer: true, appointment: { include: { client: true } } },
    orderBy: { startsAt: "asc" }
  })

  const history = await prisma.appointment.findMany({
    where: isInternal ? {} : { clientId: session.user.id },
    include: { slot: { include: { lawyer: true } }, client: true },
    orderBy: { createdAt: "desc" }
  })

  return <AppointmentManager slots={slots} history={history} canCreateSlots={isInternal} />
}
