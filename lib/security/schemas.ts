import { z } from "zod"

const text = z.string().trim().min(1).max(240).transform((value) => value.replace(/[<>]/g, ""))
const longText = z.string().trim().min(1).max(4000).transform((value) => value.replace(/[<>]/g, ""))

export const recruitmentSchema = z.object({
  firstName: text,
  lastName: text,
  email: z.string().email().max(240),
  discordUsername: text,
  motivation: longText
})

export const companySchema = z.object({
  id: z.string().cuid().optional(),
  name: text,
  registrationNumber: z.string().trim().max(80).optional(),
  notes: z.string().trim().max(2000).optional()
})

export const companyMemberSchema = z.object({
  companyId: z.string().cuid(),
  userId: z.string().cuid()
})

export const documentSchema = z.object({
  title: text,
  status: z.enum(["BROUILLON", "ENVOYE", "ARCHIVE"]),
  clientId: z.string().cuid().optional(),
  companyId: z.string().cuid().optional()
})

export const appointmentSlotSchema = z.object({
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime()
})

export const appointmentReserveSchema = z.object({
  slotId: z.string().cuid()
})

export const invoiceSchema = z.object({
  label: text,
  amountCents: z.number().int().positive().max(10_000_000),
  dueDate: z.string().datetime(),
  status: z.enum(["PAYEE", "IMPAYEE"]),
  clientId: z.string().cuid().optional(),
  companyId: z.string().cuid().optional()
})

export const knowledgeCategorySchema = z.object({
  name: text
})

export const knowledgeArticleSchema = z.object({
  title: text,
  content: longText,
  categoryId: z.string().cuid()
})
