import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { rows } = await pool.query(
          `SELECT id, email, role, password_hash FROM users
           WHERE email = $1 LIMIT 1`,
          [credentials.email]
        );

        if (!rows || rows.length === 0) return null;
        const user = rows[0];

        // verify password using pgcrypt on the DB side
        const { rows: passCheck } = await pool.query(
          `SELECT (password_hash = crypt($1, password_hash)) AS ok FROM users WHERE id = $2`,
          [credentials.password, user.id]
        );
        if (!passCheck[0] || !passCheck[0].ok) return null;

        return { id: user.id, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/login"
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET
};

export default authOptions;
