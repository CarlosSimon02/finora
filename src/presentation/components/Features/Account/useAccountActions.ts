"use client";

import { trpc } from "@/lib/trpc/client";
import { logoutAction } from "@/presentation/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UseAccountActionsReturn {
  handleLogout: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
  isLoggingOut: boolean;
  isDeletingAccount: boolean;
  logoutDialogOpen: boolean;
  setLogoutDialogOpen: (open: boolean) => void;
}

export const useAccountActions = (): UseAccountActionsReturn => {
  const router = useRouter();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const utils = trpc.useUtils();

  const deleteUserMutation = trpc.deleteUser.useMutation({
    onSuccess: async () => {
      toast.success("Account deleted successfully");
      await logoutAction();
      router.push("/login");
      await utils.invalidate();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to delete account";
      toast.error(message);
    },
  });

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);
    try {
      await logoutAction();
      toast.success("Logged out successfully");
      router.push("/login");
      await utils.invalidate();
    } catch {
      toast.error("Failed to logout");
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = async (): Promise<void> => {
    await deleteUserMutation.mutateAsync();
    await utils.invalidate();
  };

  return {
    handleLogout,
    handleDeleteAccount,
    isLoggingOut,
    isDeletingAccount: deleteUserMutation.isPending,
    logoutDialogOpen,
    setLogoutDialogOpen,
  };
};
