import Link from "next/link"
import { auth } from "@/auth"
import { DiscordLoginButton } from "@/components/features/discord-login-button"
import { SignOutButton } from "@/components/features/sign-out-button"

const publicLinks = [
  ["Tarifs", "/#tarifs"],
  ["Actualités", "/#actualites"],
  ["Recrutement", "/recrutement"]
]

const privateLinks = [
  ["Dashboard", "/dashboard"],
  ["Clients", "/clients"],
  ["Entreprises", "/entreprises"],
  ["Documents", "/documents"],
  ["Rendez-vous", "/rendez-vous"],
  ["Factures", "/factures"],
  ["Base interne", "/base-connaissances"]
]

export async function SiteHeader() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-40 border-b border-gold/10 bg-obsidian/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-gold/30 bg-gold/10 font-serif text-lg text-gold">SL</span>
          <span className="font-serif text-xl font-semibold text-gold-soft">Scott Law</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          {(session ? privateLinks : publicLinks).map(([label, href]) => (
            <Link key={href} href={href} className="rounded-md px-3 py-2 text-ivory/70 transition hover:bg-gold/10 hover:text-gold-soft">
              {label}
            </Link>
          ))}
          {session ? <SignOutButton /> : <DiscordLoginButton compact />}
        </nav>
      </div>
    </header>
  )
}
