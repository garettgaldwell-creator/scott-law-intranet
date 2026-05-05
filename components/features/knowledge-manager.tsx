"use client"

import { useState, useTransition } from "react"
import { BookOpen, Save } from "lucide-react"
import type { KnowledgeArticle, KnowledgeCategory, User } from "@prisma/client"
import { createKnowledgeArticle, createKnowledgeCategory } from "@/server/actions/knowledge"
import { Button } from "@/components/ui/button"
import { Input, Select, Textarea } from "@/components/ui/input"
import { Panel } from "@/components/ui/panel"
import { SectionTitle } from "@/components/ui/section-title"
import { useToast } from "@/components/ui/toast"

type CategoryWithArticles = KnowledgeCategory & {
  articles: Array<KnowledgeArticle & { author: User }>
}

export function KnowledgeManager({ categories }: { categories: CategoryWithArticles[] }) {
  const [categoryName, setCategoryName] = useState("")
  const [article, setArticle] = useState({ title: "", content: "", categoryId: categories[0]?.id ?? "" })
  const [pending, startTransition] = useTransition()
  const { toast } = useToast()

  function submitCategory() {
    startTransition(async () => {
      const result = await createKnowledgeCategory({ name: categoryName })
      toast({ kind: result.ok ? "success" : "error", title: result.message })
      if (result.ok) {
        setCategoryName("")
      }
    })
  }

  function submitArticle() {
    startTransition(async () => {
      const result = await createKnowledgeArticle(article)
      toast({ kind: result.ok ? "success" : "error", title: result.message })
      if (result.ok) {
        setArticle((current) => ({ title: "", content: "", categoryId: current.categoryId }))
      }
    })
  }

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <SectionTitle title="Base de connaissances" subtitle="Articles internes réservés à l’équipe Scott Law." />
          <Panel className="space-y-4">
            <Input aria-label="Nom de la catégorie" placeholder="Nom de la catégorie" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} />
            <Button onClick={submitCategory} disabled={pending || !categoryName}>
              <Save className="mr-2 h-4 w-4" aria-hidden="true" />
              Créer la catégorie
            </Button>
          </Panel>
          <Panel className="space-y-4">
            <Input aria-label="Titre de l’article" placeholder="Titre de l’article" value={article.title} onChange={(event) => setArticle((current) => ({ ...current, title: event.target.value }))} />
            <Select aria-label="Catégorie" value={article.categoryId} onChange={(event) => setArticle((current) => ({ ...current, categoryId: event.target.value }))}>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </Select>
            <Textarea aria-label="Contenu de l’article" placeholder="Contenu de l’article" value={article.content} onChange={(event) => setArticle((current) => ({ ...current, content: event.target.value }))} />
            <Button onClick={submitArticle} disabled={pending || !article.title || !article.content || !article.categoryId}>
              <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />
              Publier
            </Button>
          </Panel>
        </div>
        <div className="grid gap-4">
          {categories.map((category) => (
            <Panel key={category.id}>
              <h2 className="text-xl font-semibold text-gold-soft">{category.name}</h2>
              <div className="mt-4 space-y-3">
                {category.articles.map((item) => (
                  <article key={item.id} className="rounded-md border border-gold/10 p-4">
                    <h3 className="font-semibold text-ivory">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-ivory/68">{item.content}</p>
                    <p className="mt-3 text-xs text-ivory/48">{item.author.name ?? "Scott Law"}</p>
                  </article>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </main>
  )
}
