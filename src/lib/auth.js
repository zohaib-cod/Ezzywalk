import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        keepLogged: { label: "Keep Logged In", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://ezzywalk-b.vercel.app"}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: credentials.email, 
            password: credentials.password,
            keepLogged: credentials.keepLogged === 'true'
          })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Invalid credentials');
        }

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          backendToken: data.token
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.backendToken = user.backendToken;
        
        // Sync expiration from backend token
        try {
          const payloadBase64 = user.backendToken.split('.')[1];
          const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
          if (decodedPayload.exp) {
            token.exp = decodedPayload.exp;
          }
        } catch (e) {
          console.error("Failed to decode backend token", e);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.backendToken = token.backendToken;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback_secret_for_development',
};
