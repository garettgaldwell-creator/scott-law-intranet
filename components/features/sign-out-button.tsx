"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/" })} className="inline-flex h-10 items-center rounded-md border border-gold/30 px-3 text-sm font-medium text-gold-soft transition hover:bg-gold/10">
      <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
      Déconnexion
    </button>
  )
}
