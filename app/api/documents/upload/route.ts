import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/security/rate-limit"
import { documentSchema } from "@/lib/security/schemas"

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ message: "Connexion requise." }, { status: 401 })
  }

  const limited = rateLimit(`documents:${session.user.id}`, 20, 60_000)

  if (!limited.ok) {
    return NextResponse.json({ message: "Trop d’envois de documents." }, { status: 429 })
  }

  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Fichier manquant." }, { status: 400 })
  }

  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ message: "Le fichier dépasse la limite autorisée." }, { status: 400 })
  }

  const parsed = documentSchema.safeParse({
    title: formData.get("title"),
    status: formData.get("status"),
    clientId: formData.get("clientId") || undefined,
    companyId: formData.get("companyId") || undefined
  })

  if (!parsed.success) {
    return NextResponse.json({ message: "Métadonnées invalides." }, { status: 400 })
  }

  const rolesAllowedToUploadForOthers: UserRole[] = [UserRole.ADMIN, UserRole.AVOCAT, UserRole.MANAGER]
  const canUploadForOthers = rolesAllowedToUploadForOthers.includes(session.user.role)
  const ownerId = canUploadForOthers ? parsed.data.clientId : session.user.id
  const storageRoot = process.env.DOCUMENT_STORAGE_PATH ?? "./public/uploads"
  const absoluteRoot = path.resolve(storageRoot)
  const fileName = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`
  const storagePath = path.join(absoluteRoot, fileName)
  const bytes = Buffer.from(await file.arrayBuffer())

  await mkdir(absoluteRoot, { recursive: true })
  await writeFile(storagePath, bytes)

  await prisma.document.create({
    data: {
      title: parsed.data.title,
      fileName: file.name,
      storagePath,
      mimeType: file.type || "application/octet-stream",
      status: parsed.data.status,
      ownerId,
      companyId: parsed.data.companyId,
      uploaderId: session.user.id
    }
  })

  return NextResponse.json({ message: "Document déposé." })
}
