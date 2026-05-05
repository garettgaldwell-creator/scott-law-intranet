"use client"

import { useState, useTransition } from "react"
import { Upload } from "lucide-react"
import type { Company, Document, User } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input, Select } from "@/components/ui/input"
import { Panel } from "@/components/ui/panel"
import { SectionTitle } from "@/components/ui/section-title"
import { useToast } from "@/components/ui/toast"
import { formatDate } from "@/lib/utils"

type DocumentWithRelations = Document & {
  owner: User | null
  company: Company | null
}

type SimpleUser = {
  id: string
  name: string | null
  email: string | null
}

export function DocumentManager({ documents, users, companies, canUploadForOthers }: { documents: DocumentWithRelations[]; users: SimpleUser[]; companies: Company[]; canUploadForOthers: boolean }) {
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState("BROUILLON")
  const [clientId, setClientId] = useState("")
  const [companyId, setCompanyId] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [pending, startTransition] = useTransition()
  const { toast } = useToast()

  function upload() {
    startTransition(async () => {
      if (!file) {
        toast({ kind: "error", title: "Sélectionne un fichier." })
        return
      }

      const formData = new FormData()
      formData.set("title", title)
      formData.set("status", status)
      formData.set("file", file)

      if (clientId) {
        formData.set("clientId", clientId)
      }

      if (companyId) {
        formData.set("companyId", companyId)
      }

      const response = await fetch("/api/documents/upload", { method: "POST", body: formData })
      const payload = await response.json()
      toast({ kind: response.ok ? "success" : "error", title: payload.message ?? "Réponse inattendue." })

      if (response.ok) {
        setTitle("")
        setClientId("")
        setCompanyId("")
        setFile(null)
      }
    })
  }

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <SectionTitle title="Documents" subtitle="Dépôt, association et suivi documentaire." />
          <Panel className="space-y-4">
            <Input aria-label="Titre du document" placeholder="Titre du document" value={title} onChange={(event) => setTitle(event.target.value)} />
            <Input aria-label="Fichier" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            <Select aria-label="Statut" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="BROUILLON">Brouillon</option>
              <option value="ENVOYE">Envoyé</option>
              <option value="ARCHIVE">Archivé</option>
            </Select>
            {canUploadForOthers ? (
              <Select aria-label="Client lié" value={clientId} onChange={(event) => setClientId(event.target.value)}>
                <option value="">Aucun client lié</option>
                {users.map((user) => <option key={user.id} value={user.id}>{user.name ?? user.email ?? user.id}</option>)}
              </Select>
            ) : null}
            <Select aria-label="Entreprise liée" value={companyId} onChange={(event) => setCompanyId(event.target.value)}>
              <option value="">Aucune entreprise liée</option>
              {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
            </Select>
            <Button onClick={upload} disabled={pending}>
              <Upload className="mr-2 h-4 w-4" aria-hidden="true" />
              Déposer
            </Button>
          </Panel>
        </div>
        <div className="grid gap-4">
          {documents.map((document) => (
            <Panel key={document.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gold-soft">{document.title}</h2>
                  <p className="mt-1 text-sm text-ivory/60">{document.fileName}</p>
                </div>
                <span className="rounded-full border border-gold/20 px-3 py-1 text-xs text-gold">{document.status}</span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-ivory/68 sm:grid-cols-3">
                <span>{document.owner?.name ?? "Aucun client"}</span>
                <span>{document.company?.name ?? "Aucune entreprise"}</span>
                <span>{formatDate(document.createdAt)}</span>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </main>
  )
}
