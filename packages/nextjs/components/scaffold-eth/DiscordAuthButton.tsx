"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export const DiscordAuthButton = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button className="btn btn-primary btn-sm" disabled>
        <span className="loading loading-spinner loading-xs"></span>
      </button>
    );
  }

  if (session) {
    return (
      <button onClick={() => signOut()} className="btn btn-primary btn-sm">
        Disconnect Discord
      </button>
    );
  }

  return (
    <button onClick={() => signIn("discord")} className="btn btn-primary btn-sm">
      Connect Discord
    </button>
  );
};
