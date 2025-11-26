import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "admin" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("Authorize called with credentials:", credentials?.username);
                console.log("Admin password env:", process.env.ADMIN_PASSWORD ? "Set" : "Not Set");

                if (!credentials?.username || !credentials?.password) {
                    console.log("Missing credentials");
                    return null
                }

                if (
                    credentials.username === "admin" &&
                    credentials.password === process.env.ADMIN_PASSWORD
                ) {
                    console.log("Credentials match, returning user");
                    return { id: "1", name: "Admin", email: "admin@example.com" }
                }

                console.log("Invalid credentials");
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
