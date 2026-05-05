import { RecruitmentForm } from "@/components/features/recruitment-form"
import { SectionTitle } from "@/components/ui/section-title"

export default function RecruitmentPage() {
  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionTitle title="Recrutement" subtitle="Dépose ta candidature pour rejoindre Scott Law. Les candidatures sont consultées depuis l’espace admin." />
        </div>
        <RecruitmentForm />
      </div>
    </main>
  )
}
