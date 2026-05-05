import { UserRole } from "@prisma/client"
import { requireSession } from "@/lib/auth/guards"
import { roleLabels } from "@/lib/auth/permissions"
import { Panel } from "@/components/ui/panel"
import { SectionTitle } from "@/components/ui/section-title"

const dashboardContent: Record<UserRole, string[]> = {
  ADMIN: ["Vue globale du cabinet", "Gestion des candidatures", "Suivi des factures", "Base interne"],
  AVOCAT: ["Créneaux de disponibilité", "Dossiers assignés", "Documents clients", "Articles internes"],
  MANAGER: ["Pilotage opérationnel", "Entreprises suivies", "Comptabilité simple", "Recrutement"],
  CLIENT: ["Documents personnels", "Rendez-vous disponibles", "Factures liées", "Historique du dossier"],
  PATRON_ENTREPRISE: ["Dossiers d’entreprise", "Membres associés", "Documents société", "Factures entreprise"]
}

export default async function DashboardPage() {
  const session = await requireSession()
  const items = dashboardContent[session.user.role]

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle title={`Espace ${roleLabels[session.user.role as keyof typeof roleLabels]}`} subtitle={`Bienvenue ${session.user.name ?? "sur Scott Law"}.`} />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <Panel key={item}>
              <h2 className="text-lg font-semibold text-gold-soft">{item}</h2>
              <p className="mt-3 text-sm leading-6 text-ivory/64">Module disponible dans cette première version de l’intranet.</p>
            </Panel>
          ))}
        </div>
      </div>
    </main>
  )
}
