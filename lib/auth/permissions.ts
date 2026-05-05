export type AppRole = "ADMIN" | "AVOCAT" | "MANAGER" | "CLIENT" | "PATRON_ENTREPRISE"

export const internalRoles: AppRole[] = ["ADMIN", "AVOCAT", "MANAGER"]

export const roleLabels: Record<AppRole, string> = {
  ADMIN: "Administrateur",
  AVOCAT: "Avocat",
  MANAGER: "Manager",
  CLIENT: "Client",
  PATRON_ENTREPRISE: "Patron d’entreprise"
}

const allRoles: AppRole[] = ["ADMIN", "AVOCAT", "MANAGER", "CLIENT", "PATRON_ENTREPRISE"]

const pathRoles: Array<[string, AppRole[]]> = [
  ["/base-connaissances", internalRoles],
  ["/recrutement/admin", ["ADMIN", "MANAGER"]],
  ["/clients", internalRoles],
  ["/entreprises", ["ADMIN", "AVOCAT", "MANAGER", "PATRON_ENTREPRISE"]],
  ["/documents", allRoles],
  ["/rendez-vous", allRoles],
  ["/factures", ["ADMIN", "MANAGER", "CLIENT", "PATRON_ENTREPRISE"]],
  ["/dashboard", allRoles]
]

export function canAccessPath(role: string, pathname: string) {
  const userRole = role as AppRole
  const match = pathRoles.find(([path]) => pathname.startsWith(path))
  return match ? match[1].includes(userRole) : true
}

export function hasAnyRole(role: AppRole, allowedRoles: AppRole[]) {
  return allowedRoles.includes(role)
}
