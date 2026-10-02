import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: '/account',
  },
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
      if (session.user) {
        // You can attach custom properties here
        (session.user as any).id = token.sub;
      }
      return session;
    }
  }
};
