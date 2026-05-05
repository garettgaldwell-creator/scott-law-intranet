"use client"

import { useMemo, useState, useTransition } from "react"
import { Receipt, Save } from "lucide-react"
import type { Company, Invoice, User } from "@prisma/client"
import { createInvoice } from "@/server/actions/invoices"
import { Button } from "@/components/ui/button"
import { Input, Select } from "@/components/ui/input"
import { Panel } from "@/components/ui/panel"
import { SectionTitle } from "@/components/ui/section-title"
import { useToast } from "@/components/ui/toast"
import { formatCurrency, formatDate } from "@/lib/utils"

type InvoiceWithRelations = Invoice & {
  client: User | null
  company: Company | null
}

type SimpleUser = {
  id: string
  name: string | null
  email: string | null
}

export function InvoiceManager({ invoices, users, companies, canManage }: { invoices: InvoiceWithRelations[]; users: SimpleUser[]; companies: Company[]; canManage: boolean }) {
  const [input, setInput] = useState({ label: "", amount: "", dueDate: "", status: "IMPAYEE", clientId: "", companyId: "" })
  const [pending, startTransition] = useTransition()
  const { toast } = useToast()

  const totals = useMemo(() => {
    return invoices.reduce(
      (accumulator, invoice) => {
        if (invoice.status === "PAYEE") {
          accumulator.paid += invoice.amountCents
        } else {
          accumulator.unpaid += invoice.amountCents
        }
        return accumulator
      },
      { paid: 0, unpaid: 0 }
    )
  }, [invoices])

  function submit() {
    startTransition(async () => {
      const result = await createInvoice({
        label: input.label,
        amountCents: Math.round(Number(input.amount) * 100),
        dueDate: new Date(input.dueDate).toISOString(),
        status: input.status,
        clientId: input.clientId || undefined,
        companyId: input.companyId || undefined
      })
      toast({ kind: result.ok ? "success" : "error", title: result.message })
      if (result.ok) {
        setInput({ label: "", amount: "", dueDate: "", status: "IMPAYEE", clientId: "", companyId: "" })
      }
    })
  }

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <SectionTitle title="Factures" subtitle="Création simple et suivi comptable sans logique de paiement." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Panel>
              <p className="text-sm text-ivory/60">Payé</p>
              <p className="mt-2 text-2xl font-semibold text-gold">{formatCurrency(totals.paid)}</p>
            </Panel>
            <Panel>
              <p className="text-sm text-ivory/60">Impayé</p>
              <p className="mt-2 text-2xl font-semibold text-gold">{formatCurrency(totals.unpaid)}</p>
            </Panel>
          </div>
          {canManage ? (
            <Panel className="space-y-4">
              <Input aria-label="Libellé" placeholder="Libellé" value={input.label} onChange={(event) => setInput((current) => ({ ...current, label: event.target.value }))} />
              <Input aria-label="Montant en euros" placeholder="Montant en euros" type="number" min="0" step="0.01" value={input.amount} onChange={(event) => setInput((current) => ({ ...current, amount: event.target.value }))} />
              <Input aria-label="Date d’échéance" type="datetime-local" value={input.dueDate} onChange={(event) => setInput((current) => ({ ...current, dueDate: event.target.value }))} />
              <Select aria-label="Statut" value={input.status} onChange={(event) => setInput((current) => ({ ...current, status: event.target.value }))}>
                <option value="IMPAYEE">Impayée</option>
                <option value="PAYEE">Payée</option>
              </Select>
              <Select aria-label="Client lié" value={input.clientId} onChange={(event) => setInput((current) => ({ ...current, clientId: event.target.value }))}>
                <option value="">Aucun client lié</option>
                {users.map((user) => <option key={user.id} value={user.id}>{user.name ?? user.email ?? user.id}</option>)}
              </Select>
              <Select aria-label="Entreprise liée" value={input.companyId} onChange={(event) => setInput((current) => ({ ...current, companyId: event.target.value }))}>
                <option value="">Aucune entreprise liée</option>
                {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
              </Select>
              <Button onClick={submit} disabled={pending || !input.label || !input.amount || !input.dueDate}>
                <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                Créer la facture
              </Button>
            </Panel>
          ) : null}
        </div>
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <Panel key={invoice.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-gold-soft">
                    <Receipt className="h-5 w-5" aria-hidden="true" />
                    {invoice.label}
                  </h2>
                  <p className="mt-1 text-sm text-ivory/60">{invoice.client?.name ?? invoice.company?.name ?? "Aucun rattachement"}</p>
                </div>
                <span className="rounded-full border border-gold/20 px-3 py-1 text-xs text-gold">{invoice.status}</span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-ivory/68 sm:grid-cols-2">
                <span>{formatCurrency(invoice.amountCents)}</span>
                <span>{formatDate(invoice.dueDate)}</span>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </main>
  )
}
