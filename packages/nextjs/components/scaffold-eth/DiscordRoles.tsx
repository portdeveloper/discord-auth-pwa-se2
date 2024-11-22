"use client";

import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

interface RoleDisplay {
  monadServer: string[];
  monadDevServer: string[];
}

interface ExtendedSession extends Session {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roles?: RoleDisplay;
  };
}

const MONAD_SERVER_ROLES: Record<string, string> = {
  "1036887714466902047": "team",
  "1073054714092073000": "community team",
  "1172573469108613130": "mon2",
  "1037873237159321612": "mon",
  "1046330093569593418": "nad-OG",
  "1038728318666682378": "quant",
  "1051562453495971941": "nads",
  "1194003002298740816": "localnads",
  "1072682201658970112": "full access",
};

const MONAD_DEV_ROLES: Record<string, string> = {
  "1266373787696369779": "Guild Master",
  "1304748221960163338": "DevRelApprentice",
  "1266373833850486844": "Project Lead",
  "1277285698579468411": "Guild Squire",
  "1275572728828792883": "Tradesman",
  "1266373880960778240": "Contributor",
  "1275572482279084082": "Apprentice",
  "1266375156163412018": "Monad Native Builder",
  "1263596865283162177": "Developer",
  "1275571500996497478": "Metrics Guild",
  "1263596865283162175": "UI/UX/Design",
  "1266373543700992105": "early",
  "1266373670020845691": "Learner",
  "1263596865233096721": "full access",
  "1275163198642978868": "validator",
  "1263596865233096719": "proof of build",
};

export const DiscordRoles = () => {
  const { data: session, status } = useSession() as { data: ExtendedSession | null; status: string };
  const [roles, setRoles] = useState<RoleDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (session?.user?.roles) {
      const rawRoles = session.user.roles;
      if (rawRoles.monadServer.length > 0 || rawRoles.monadDevServer.length > 0) {
        const mappedRoles = {
          monadServer: rawRoles.monadServer.map(roleId => MONAD_SERVER_ROLES[roleId] || `Role ID: ${roleId}`),
          monadDevServer: rawRoles.monadDevServer.map(roleId => MONAD_DEV_ROLES[roleId] || `Role ID: ${roleId}`),
        };
        setRoles(mappedRoles);
      }
    }
    setIsLoading(false);
  }, [session, status]);

  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Discord Roles</h2>
          <div className="flex items-center justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Discord Roles</h2>
          <p className="text-center py-4">Connect with Discord to view your roles</p>
        </div>
      </div>
    );
  }

  if (!roles) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Discord Roles</h2>
          <p className="text-center py-4">No roles found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl w-1/2">
      <div className="card-body">
        <h2 className="card-title">Discord Roles</h2>

        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Monad Server Roles:</h3>
          {roles.monadServer.length > 0 ? (
            <ul className="list-disc list-inside">
              {roles.monadServer.map((role, index) => (
                <li key={index} className="text-sm">
                  {role}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No roles</p>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Monad Dev Server Roles:</h3>
          {roles.monadDevServer.length > 0 ? (
            <ul className="list-disc list-inside">
              {roles.monadDevServer.map((role, index) => (
                <li key={index} className="text-sm">
                  {role}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No roles</p>
          )}
        </div>
      </div>
    </div>
  );
};
