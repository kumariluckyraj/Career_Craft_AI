import connectDB from '@/db/connectDb';
import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import User from '@/models/User';

export const authOptions = {
  debug: true,

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      await connectDB();

      if (!user?.email) return false;

      let dbUser = await User.findOne({ email: user.email });

      if (!dbUser) {
        dbUser = await User.create({
          email: user.email,
          username: user.email.split('@')[0],
        });
      }

      // attach DB id to user object
      user.id = dbUser._id.toString();
      user.name = dbUser.username;

      return true;
    },

    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };