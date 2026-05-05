import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { hasAnyRole, type AppRole } from "@/lib/auth/permissions"
import type { UserRole } from "@prisma/client"

export async function requireSession() {
  const session = await auth()
  if (!session?.user) {
    redirect("/")
  }
  return session
}

export async function requireRoles(roles: UserRole[]) {
  const session = await requireSession()
  if (!hasAnyRole(session.user.role as AppRole, roles.map(String) as AppRole[])) {
    redirect("/dashboard")
  }
  return session
}
