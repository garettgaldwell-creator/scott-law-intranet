"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react"

type ToastKind = "success" | "error" | "info" | "warning"
type Toast = { id: string; kind: ToastKind; title: string }
type ToastContextValue = { toast: (toast: Omit<Toast, "id">) => void }

const ToastContext = createContext<ToastContextValue | null>(null)

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: TriangleAlert
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((nextToast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID()
    setToasts((current) => [...current, { ...nextToast, id }])
    setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id))
    }, 3600)
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 grid w-[calc(100vw-2rem)] max-w-sm gap-3">
        {toasts.map((item) => {
          const Icon = icons[item.kind]
          return (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border border-gold/20 bg-graphite px-4 py-3 text-sm text-ivory shadow-gold">
              <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
              <span className="flex-1">{item.title}</span>
              <button aria-label="Fermer la notification" className="rounded p-1 text-ivory/60 hover:bg-gold/10 hover:text-gold-soft" onClick={() => setToasts((current) => current.filter((toast) => toast.id !== item.id))}>
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const value = useContext(ToastContext)
  if (!value) {
    throw new Error("Le système de notifications est indisponible.")
  }
  return value
}
