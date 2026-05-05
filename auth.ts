import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  providers: [
    Discord({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
      authorization: {
        params: {
          scope: "identify email"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "discord" && user.id) {
        const discordProfile = profile as { id?: string; username?: string; avatar?: string } | undefined
        await prisma.user.update({
          where: { id: user.id },
          data: {
            discordId: discordProfile?.id ?? account.providerAccountId,
            name: discordProfile?.username ?? user.name,
            image: user.image
          }
        })
      }
      return true
    },
    async jwt({ token, user }) {
      if (user?.id) {
        const databaseUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { id: true, role: true, discordId: true }
        })
        token.id = databaseUser?.id ?? user.id
        token.role = databaseUser?.role ?? UserRole.CLIENT
        token.discordId = databaseUser?.discordId ?? null
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id)
        session.user.role = token.role as UserRole
        session.user.discordId = typeof token.discordId === "string" ? token.discordId : null
      }
      return session
    }
  },
  pages: {
    signIn: "/",
    error: "/"
  }
})
