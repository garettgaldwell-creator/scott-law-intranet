"use client"

import { useState, useTransition } from "react"
import { CalendarPlus, Check } from "lucide-react"
import type { Appointment, AppointmentSlot, User } from "@prisma/client"
import { createAppointmentSlot, reserveAppointment } from "@/server/actions/appointments"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Panel } from "@/components/ui/panel"
import { SectionTitle } from "@/components/ui/section-title"
import { useToast } from "@/components/ui/toast"
import { formatDate } from "@/lib/utils"

type SlotWithRelations = AppointmentSlot & {
  lawyer: User
  appointment: (Appointment & { client: User }) | null
}

type AppointmentWithRelations = Appointment & {
  slot: AppointmentSlot & { lawyer: User }
  client: User
}

export function AppointmentManager({ slots, history, canCreateSlots }: { slots: SlotWithRelations[]; history: AppointmentWithRelations[]; canCreateSlots: boolean }) {
  const [startsAt, setStartsAt] = useState("")
  const [endsAt, setEndsAt] = useState("")
  const [pending, startTransition] = useTransition()
  const { toast } = useToast()

  function createSlot() {
    startTransition(async () => {
      const result = await createAppointmentSlot({ startsAt: new Date(startsAt).toISOString(), endsAt: new Date(endsAt).toISOString() })
      toast({ kind: result.ok ? "success" : "error", title: result.message })
      if (result.ok) {
        setStartsAt("")
        setEndsAt("")
      }
    })
  }

  function reserve(slotId: string) {
    startTransition(async () => {
      const result = await reserveAppointment({ slotId })
      toast({ kind: result.ok ? "success" : "error", title: result.message })
    })
  }

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <SectionTitle title="Rendez-vous" subtitle="Créneaux disponibles, réservation et historique." />
          {canCreateSlots ? (
            <Panel className="space-y-4">
              <Input aria-label="Début du créneau" type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} />
              <Input aria-label="Fin du créneau" type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} />
              <Button onClick={createSlot} disabled={pending || !startsAt || !endsAt}>
                <CalendarPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                Créer le créneau
              </Button>
            </Panel>
          ) : null}
          <Panel>
            <h2 className="text-lg font-semibold text-gold-soft">Historique</h2>
            <div className="mt-4 space-y-3">
              {history.map((appointment) => (
                <div key={appointment.id} className="rounded-md border border-gold/10 p-3 text-sm text-ivory/70">
                  {formatDate(appointment.slot.startsAt)} · {appointment.status} · {appointment.client.name ?? "Client"}
                </div>
              ))}
            </div>
          </Panel>
        </div>
        <div className="grid gap-4">
          {slots.map((slot) => (
            <Panel key={slot.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gold-soft">{formatDate(slot.startsAt)}</h2>
                  <p className="mt-1 text-sm text-ivory/60">Avocat : {slot.lawyer.name ?? "Scott Law"}</p>
                </div>
                {slot.appointment ? (
                  <span className="rounded-full border border-gold/20 px-3 py-1 text-xs text-gold">Réservé</span>
                ) : (
                  <Button onClick={() => reserve(slot.id)} disabled={pending}>
                    <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                    Réserver
                  </Button>
                )}
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </main>
  )
}
