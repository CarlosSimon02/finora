"use client";

import { User } from "@/core/schemas";
import { Card } from "@/presentation/components/Primitives";
import { Avatar } from "@/presentation/components/UI";

interface AccountProfileProps {
  user: User | null;
  isGuest: boolean;
}

const getUserInitial = (user: User | null): string => {
  if (user?.displayName) {
    return user.displayName.charAt(0).toUpperCase();
  }
  if (user?.email) {
    return user.email.charAt(0).toUpperCase();
  }
  return "U";
};

export const AccountProfile = ({ user, isGuest }: AccountProfileProps) => {
  return (
    <Card className="space-y-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <Avatar className="size-24 sm:size-32">
          <Avatar.Image
            src={user?.photoURL ?? ""}
            alt={user?.displayName ?? user?.email ?? "User avatar"}
          />
          <Avatar.Fallback className="txt-preset-1 bg-grey-900 text-white">
            {getUserInitial(user)}
          </Avatar.Fallback>
        </Avatar>

        <div className="flex-1 space-y-2 text-center sm:text-left">
          <h2 className="txt-preset-1 text-grey-900">
            {user?.displayName || "User"}
          </h2>
          <p className="txt-preset-4 text-grey-500">{user?.email}</p>
          {isGuest && (
            <span className="txt-preset-5 text-secondary-red bg-secondary-red/10 inline-block rounded-md px-3 py-1">
              Guest Account
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
