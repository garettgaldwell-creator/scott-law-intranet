import { PrismaClient, UserRole } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.knowledgeCategory.upsert({
    where: { name: "Procédures internes" },
    update: {},
    create: { name: "Procédures internes" }
  })

  await prisma.knowledgeCategory.upsert({
    where: { name: "Dossiers clients" },
    update: {},
    create: { name: "Dossiers clients" }
  })

  await prisma.user.upsert({
    where: { email: "admin@scott-law.local" },
    update: { role: UserRole.ADMIN },
    create: {
      email: "admin@scott-law.local",
      name: "Administration Scott Law",
      role: UserRole.ADMIN
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
