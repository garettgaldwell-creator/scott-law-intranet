export function sanitizeText(value: string) {
  return value.replace(/[<>]/g, "").trim()
}

export function sanitizeOptionalText(value?: string | null) {
  return value ? sanitizeText(value) : null
}
