"use client"

import { useState, useTransition } from "react"
import { Building2, Save, UserPlus } from "lucide-react"
import type { Company, CompanyMember, Document, LegalCase, User, UserRole } from "@prisma/client"
import { attachUserToCompany, saveCompany } from "@/server/actions/companies"
import { Button } from "@/components/ui/button"
import { Input, Select, Textarea } from "@/components/ui/input"
import { Panel } from "@/components/ui/panel"
import { SectionTitle } from "@/components/ui/section-title"
import { useToast } from "@/components/ui/toast"

type CompanyWithRelations = Company & {
  members: Array<CompanyMember & { user: User }>
  cases: LegalCase[]
  documents: Document[]
}

type SimpleUser = {
  id: string
  name: string | null
  email: string | null
  role: UserRole
}

const emptyCompany = {
  id: "",
  name: "",
  registrationNumber: "",
  notes: ""
}

export function CompanyManager({ companies, users, canManage }: { companies: CompanyWithRelations[]; users: SimpleUser[]; canManage: boolean }) {
  const [companyInput, setCompanyInput] = useState(emptyCompany)
  const [memberInput, setMemberInput] = useState({ companyId: companies[0]?.id ?? "", userId: users[0]?.id ?? "" })
  const [pending, startTransition] = useTransition()
  const { toast } = useToast()

  function submitCompany() {
    startTransition(async () => {
      const result = await saveCompany(companyInput.id ? companyInput : { ...companyInput, id: undefined })
      toast({ kind: result.ok ? "success" : "error", title: result.message })
      if (result.ok) {
        setCompanyInput(emptyCompany)
      }
    })
  }

  function submitMember() {
    startTransition(async () => {
      const result = await attachUserToCompany(memberInput)
      toast({ kind: result.ok ? "success" : "error", title: result.message })
    })
  }

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <SectionTitle title="Entreprises" subtitle="Création, consultation, modification, membres associés et dossiers liés." />
          {canManage ? (
            <Panel className="space-y-4">
              <Input aria-label="Nom de l’entreprise" placeholder="Nom de l’entreprise" value={companyInput.name} onChange={(event) => setCompanyInput((current) => ({ ...current, name: event.target.value }))} />
              <Input aria-label="Numéro d’enregistrement" placeholder="Numéro d’enregistrement" value={companyInput.registrationNumber} onChange={(event) => setCompanyInput((current) => ({ ...current, registrationNumber: event.target.value }))} />
              <Textarea aria-label="Notes" placeholder="Notes" value={companyInput.notes} onChange={(event) => setCompanyInput((current) => ({ ...current, notes: event.target.value }))} />
              <Button onClick={submitCompany} disabled={pending}>
                <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                Enregistrer
              </Button>
            </Panel>
          ) : null}
          {canManage ? (
            <Panel className="space-y-4">
              <Select aria-label="Entreprise" value={memberInput.companyId} onChange={(event) => setMemberInput((current) => ({ ...current, companyId: event.target.value }))}>
                {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
              </Select>
              <Select aria-label="Utilisateur" value={memberInput.userId} onChange={(event) => setMemberInput((current) => ({ ...current, userId: event.target.value }))}>
                {users.map((user) => <option key={user.id} value={user.id}>{user.name ?? user.email ?? user.id}</option>)}
              </Select>
              <Button onClick={submitMember} disabled={pending || !memberInput.companyId || !memberInput.userId}>
                <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                Associer
              </Button>
            </Panel>
          ) : null}
        </div>
        <div className="grid gap-4">
          {companies.map((company) => (
            <Panel key={company.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-gold-soft">
                    <Building2 className="h-5 w-5" aria-hidden="true" />
                    {company.name}
                  </h2>
                  <p className="mt-2 text-sm text-ivory/60">{company.registrationNumber ?? "Aucun numéro renseigné"}</p>
                </div>
                {canManage ? (
                  <button onClick={() => setCompanyInput({ id: company.id, name: company.name, registrationNumber: company.registrationNumber ?? "", notes: company.notes ?? "" })} className="rounded-md border border-gold/25 px-3 py-2 text-sm text-gold-soft hover:bg-gold/10">
                    Modifier
                  </button>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-ivory/70">{company.notes ?? "Aucune note."}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border border-gold/10 p-3 text-sm text-ivory/70">{company.members.length} membre(s)</div>
                <div className="rounded-md border border-gold/10 p-3 text-sm text-ivory/70">{company.cases.length} dossier(s)</div>
                <div className="rounded-md border border-gold/10 p-3 text-sm text-ivory/70">{company.documents.length} document(s)</div>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </main>
  )
}
