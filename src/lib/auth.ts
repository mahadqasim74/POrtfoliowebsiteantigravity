import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const adminPassword = process.env.ADMIN_PASSWORD

                if (credentials?.password === adminPassword) {
                    return { id: "1", name: "Admin", email: "admin@example.com" }
                }

                return null
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }) {
            return session
        },
        async jwt({ token, user }) {
            return token
        }
    }
}
