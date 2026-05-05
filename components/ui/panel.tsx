import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-lg border border-gold/15 bg-graphite p-5", className)}>{children}</div>
}
