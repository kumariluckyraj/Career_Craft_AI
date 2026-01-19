import connectDB from '@/db/connectDb';
import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import User from '@/models/User';

export const authOptions = {
  debug: true,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

 callbacks: {
  async signIn({ user, account }) {
    await connectDB();

    if (account.provider === 'github') {
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
    }
    return false;
  },

  async jwt({ token, user }) {
    // runs on login
    if (user?.id) {
      token.id = user.id;
    }
    return token;
  },

  async session({ session, token }) {
    // expose id to session
    if (session.user && token.id) {
      session.user.id = token.id;
    }
    console.log("SESSION USER:", session.user);
    return session;
  },
},

};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
