import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      // avatarUrl removido para evitar headers muito grandes
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    // avatarUrl não é mais parte da sessão JWT
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    // avatarUrl removido para evitar JWT muito grande
  }
}
