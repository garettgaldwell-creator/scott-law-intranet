"use server"

import { UserRole } from "@prisma/client"
import { requireRoles, requireSession } from "@/lib/auth/guards"
import { prisma } from "@/lib/prisma"
import { appointmentReserveSchema, appointmentSlotSchema } from "@/lib/security/schemas"

export async function createAppointmentSlot(input: unknown) {
  const session = await requireRoles([UserRole.ADMIN, UserRole.AVOCAT])
  const parsed = appointmentSlotSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, message: "Le créneau est invalide." }
  }

  const startsAt = new Date(parsed.data.startsAt)
  const endsAt = new Date(parsed.data.endsAt)

  if (endsAt <= startsAt) {
    return { ok: false, message: "L’heure de fin doit être après l’heure de début." }
  }

  await prisma.appointmentSlot.create({
    data: {
      lawyerId: session.user.id,
      startsAt,
      endsAt
    }
  })

  return { ok: true, message: "Créneau créé." }
}

export async function reserveAppointment(input: unknown) {
  const session = await requireSession()
  const parsed = appointmentReserveSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, message: "Le créneau sélectionné est invalide." }
  }

  const slot = await prisma.appointmentSlot.findUnique({
    where: { id: parsed.data.slotId },
    include: { appointment: true }
  })

  if (!slot || slot.appointment) {
    return { ok: false, message: "Ce créneau n’est plus disponible." }
  }

  await prisma.appointment.create({
    data: {
      slotId: slot.id,
      clientId: session.user.id
    }
  })

  return { ok: true, message: "Rendez-vous réservé." }
}
