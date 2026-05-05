import { UserRole } from "@prisma/client"
import { requireRoles } from "@/lib/auth/guards"
import { prisma } from "@/lib/prisma"
import { Panel } from "@/components/ui/panel"
import { SectionTitle } from "@/components/ui/section-title"

export default async function ClientsPage() {
  await requireRoles([UserRole.ADMIN, UserRole.AVOCAT, UserRole.MANAGER])

  const clients = await prisma.user.findMany({
    where: { role: { in: [UserRole.CLIENT, UserRole.PATRON_ENTREPRISE] } },
    include: {
      companyMemberships: { include: { company: true } },
      clientCases: true,
      documents: true,
      invoices: true,
      appointments: true
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle title="Clients" subtitle="Consultation des clients, entreprises liées, dossiers, documents, factures et rendez-vous." />
        <div className="mt-8 grid gap-4">
          {clients.map((client) => (
            <Panel key={client.id}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gold-soft">{client.name ?? client.email ?? "Client sans nom"}</h2>
                  <p className="mt-1 text-sm text-ivory/60">{client.discordId ?? "Discord non renseigné"} · {client.role}</p>
                </div>
                <span className="rounded-full border border-gold/20 px-3 py-1 text-xs text-gold">{client.companyMemberships.length} entreprise(s)</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                <div className="rounded-md border border-gold/10 p-3 text-sm text-ivory/70">{client.clientCases.length} dossier(s)</div>
                <div className="rounded-md border border-gold/10 p-3 text-sm text-ivory/70">{client.documents.length} document(s)</div>
                <div className="rounded-md border border-gold/10 p-3 text-sm text-ivory/70">{client.invoices.length} facture(s)</div>
                <div className="rounded-md border border-gold/10 p-3 text-sm text-ivory/70">{client.appointments.length} rendez-vous</div>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </main>
  )
}
