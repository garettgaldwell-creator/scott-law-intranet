export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="font-serif text-3xl font-semibold text-gold-soft">{title}</h2>
      {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-ivory/64">{subtitle}</p> : null}
    </div>
  )
}
