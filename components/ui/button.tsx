import Link from "next/link"
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

const variants = {
  primary: "bg-gold text-obsidian hover:bg-gold-soft",
  secondary: "border border-gold/30 text-gold-soft hover:bg-gold/10",
  ghost: "text-ivory/76 hover:bg-gold/10 hover:text-gold-soft"
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  variant?: keyof typeof variants
  children: ReactNode
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn("inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60", variants[variant], className)}
      {...props}
    />
  )
}

export function ButtonLink({ className, variant = "primary", href, children, ...props }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold transition", variants[variant], className)}
      {...props}
    >
      {children}
    </Link>
  )
}
