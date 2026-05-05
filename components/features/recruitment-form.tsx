"use client"

import { useState, useTransition } from "react"
import { Send } from "lucide-react"
import { submitRecruitmentApplication } from "@/server/actions/recruitment"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { Panel } from "@/components/ui/panel"
import { useToast } from "@/components/ui/toast"

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  discordUsername: "",
  motivation: ""
}

export function RecruitmentForm() {
  const [state, setState] = useState(initialState)
  const [pending, startTransition] = useTransition()
  const { toast } = useToast()

  function updateField(field: keyof typeof state, value: string) {
    setState((current) => ({ ...current, [field]: value }))
  }

  function submit() {
    startTransition(async () => {
      const result = await submitRecruitmentApplication(state)
      toast({ kind: result.ok ? "success" : "error", title: result.message })
      if (result.ok) {
        setState(initialState)
      }
    })
  }

  return (
    <Panel className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input aria-label="Prénom" placeholder="Prénom" value={state.firstName} onChange={(event) => updateField("firstName", event.target.value)} />
        <Input aria-label="Nom" placeholder="Nom" value={state.lastName} onChange={(event) => updateField("lastName", event.target.value)} />
      </div>
      <Input aria-label="Adresse e-mail" placeholder="Adresse e-mail" type="email" value={state.email} onChange={(event) => updateField("email", event.target.value)} />
      <Input aria-label="Pseudo Discord" placeholder="Pseudo Discord" value={state.discordUsername} onChange={(event) => updateField("discordUsername", event.target.value)} />
      <Textarea aria-label="Motivation" placeholder="Motivation" value={state.motivation} onChange={(event) => updateField("motivation", event.target.value)} />
      <Button onClick={submit} disabled={pending}>
        <Send className="mr-2 h-4 w-4" aria-hidden="true" />
        Envoyer la candidature
      </Button>
    </Panel>
  )
}
