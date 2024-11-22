import NextAuth from "next-auth";
import { Session } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// Extend the built-in session type
interface ExtendedSession extends Session {
  accessToken?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roles?: {
      monadServer: string[];
      monadDevServer: string[];
    };
  };
}

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "identify guilds guilds.members.read",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }): Promise<ExtendedSession> {
      const extendedSession = session as ExtendedSession;
      extendedSession.accessToken = token.accessToken as string;

      if (extendedSession.user) {
        extendedSession.user.roles = await getUserRoles(token.accessToken as string);
      }

      return extendedSession;
    },
  },
});

async function getUserRoles(accessToken: string) {
  const monadServer = "1036357772826120242";
  const monadDevServer = "1263596865233096714";

  const roles = {
    monadServer: [] as string[],
    monadDevServer: [] as string[],
  };

  try {
    // Get user's roles in Monad Server
    const monadResponse = await fetch(`https://discord.com/api/users/@me/guilds/${monadServer}/member`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (monadResponse.ok) {
      const monadData = await monadResponse.json();
      roles.monadServer = monadData.roles;
    }

    // Get user's roles in Monad Developers Server
    const devResponse = await fetch(`https://discord.com/api/users/@me/guilds/${monadDevServer}/member`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (devResponse.ok) {
      const devData = await devResponse.json();
      roles.monadDevServer = devData.roles;
    }
  } catch (error) {
    console.error("Error fetching Discord roles:", error);
  }

  return roles;
}

export { handler as GET, handler as POST };
