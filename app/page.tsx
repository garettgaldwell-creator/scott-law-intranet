import Link from "next/link"
import { DiscordLoginButton } from "@/components/features/discord-login-button"
import { SectionTitle } from "@/components/ui/section-title"

const pricing = [
  ["Consultation initiale", "Analyse de votre situation RP et orientation juridique.", "Sur devis"],
  ["Accompagnement dossier", "Suivi complet, pièces, rendez-vous et stratégie.", "Forfait"],
  ["Conseil entreprise", "Contrats, litiges commerciaux et conformité interne.", "Mensuel"]
]

const news = [
  "Ouverture du portail client Scott Law",
  "Nouveaux créneaux de rendez-vous juridiques",
  "Renforcement de l’accompagnement des entreprises RP"
]

const reviews = [
  "Un cabinet sérieux, clair et réactif.",
  "Suivi impeccable de notre dossier d’entreprise.",
  "Les explications sont précises et compréhensibles."
]

export default function HomePage() {
  return (
    <main>
      <section className="px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold-soft">
              Cabinet d’avocat RP
            </div>
            <div className="space-y-5">
              <h1 className="font-serif text-5xl font-semibold tracking-normal text-ivory sm:text-6xl lg:text-7xl">
                Scott Law
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-ivory/72">
                Un intranet juridique sécurisé pour centraliser les dossiers, documents, rendez-vous, factures et échanges internes du cabinet.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <DiscordLoginButton />
              <Link href="/recrutement" className="inline-flex h-11 items-center justify-center rounded-md border border-gold/30 px-5 text-sm font-medium text-gold-soft transition hover:bg-gold/10">
                Recrutement
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-gold/20 bg-graphite p-6 shadow-gold">
            <div className="flex aspect-square items-center justify-center rounded-md border border-gold/20 bg-obsidian">
              <div className="text-center">
                <div className="font-serif text-4xl text-gold-soft">Scott Law</div>
                <div className="mt-3 text-sm uppercase tracking-[0.32em] text-gold">Justice et rigueur</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="tarifs" className="border-y border-gold/10 bg-graphite/60 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle title="Tarifs" subtitle="Des offres adaptées aux besoins des clients et des entreprises." />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {pricing.map(([title, description, price]) => (
              <article key={title} className="rounded-lg border border-gold/15 bg-obsidian p-5">
                <h3 className="text-lg font-semibold text-gold-soft">{title}</h3>
                <p className="mt-3 min-h-16 text-sm leading-6 text-ivory/68">{description}</p>
                <p className="mt-6 text-2xl font-semibold text-gold">{price}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="actualites" className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div>
            <SectionTitle title="Actualités" subtitle="Les dernières informations du cabinet." />
            <div className="mt-6 space-y-3">
              {news.map((item) => (
                <div key={item} className="rounded-md border border-gold/15 px-4 py-3 text-ivory/80">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionTitle title="Avis clients" subtitle="Retours récents sur l’accompagnement Scott Law." />
            <div className="mt-6 space-y-3">
              {reviews.map((item) => (
                <blockquote key={item} className="rounded-md border border-gold/15 bg-graphite px-4 py-3 text-ivory/80">
                  {item}
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
