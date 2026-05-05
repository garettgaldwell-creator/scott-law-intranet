import { UserRole } from "@prisma/client"
import { requireRoles } from "@/lib/auth/guards"
import { prisma } from "@/lib/prisma"
import { SectionTitle } from "@/components/ui/section-title"
import { Panel } from "@/components/ui/panel"
import { formatDate } from "@/lib/utils"

export default async function RecruitmentAdminPage() {
  await requireRoles([UserRole.ADMIN, UserRole.MANAGER])
  const applications = await prisma.recruitmentApplication.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle title="Candidatures" subtitle="Consultation des candidatures reçues depuis la page recrutement." />
        <div className="mt-8 grid gap-4">
          {applications.map((application) => (
            <Panel key={application.id}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gold-soft">{application.firstName} {application.lastName}</h2>
                  <p className="text-sm text-ivory/60">{application.email} · {application.discordUsername}</p>
                </div>
                <span className="rounded-full border border-gold/20 px-3 py-1 text-xs text-gold">{application.status}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-ivory/76">{application.motivation}</p>
              <p className="mt-4 text-xs text-ivory/48">{formatDate(application.createdAt)}</p>
            </Panel>
          ))}
        </div>
      </div>
    </main>
  )
}
