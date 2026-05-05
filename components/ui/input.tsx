import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-11 w-full rounded-md border border-gold/20 bg-obsidian px-3 text-sm text-ivory placeholder:text-ivory/36", className)} {...props} />
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-32 w-full rounded-md border border-gold/20 bg-obsidian px-3 py-3 text-sm text-ivory placeholder:text-ivory/36", className)} {...props} />
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("h-11 w-full rounded-md border border-gold/20 bg-obsidian px-3 text-sm text-ivory", className)} {...props} />
}
