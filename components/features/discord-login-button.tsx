"use client"

import { signIn } from "next-auth/react"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DiscordLoginButton({ compact = false }: { compact?: boolean }) {
  return (
    <Button onClick={() => signIn("discord", { callbackUrl: "/dashboard" })} className={compact ? "h-10 px-3" : ""}>
      <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
      {compact ? "Discord" : "Connexion avec Discord"}
    </Button>
  )
}
