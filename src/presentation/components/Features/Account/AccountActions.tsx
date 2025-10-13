"use client";

import { Button, Card } from "@/presentation/components/Primitives";
import { ConfirmDeleteDialog, Dialog } from "@/presentation/components/UI";
import { SignOutIcon, TrashIcon } from "@phosphor-icons/react";
import { AccountActionCard } from "./AccountActionCard";
import { useAccountActions } from "./useAccountActions";

interface AccountActionsProps {
  isGuest: boolean;
}

export const AccountActions = ({ isGuest }: AccountActionsProps) => {
  const {
    handleLogout,
    handleDeleteAccount,
    isLoggingOut,
    isDeletingAccount,
    logoutDialogOpen,
    setLogoutDialogOpen,
  } = useAccountActions();

  return (
    <Card className="space-y-6">
      <div>
        <h3 className="txt-preset-2 text-grey-900 mb-2">Account Actions</h3>
        <p className="txt-preset-5 text-grey-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div>
        <AccountActionCard
          icon={SignOutIcon}
          iconClassName="bg-grey-900"
          title="Logout"
          description="Sign out of your account"
          action={
            <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
              <Dialog.Trigger asChild>
                <Button label="Logout" />
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Logout Confirmation</Dialog.Title>
                  <Dialog.Description>
                    Are you sure you want to logout? You&apos;ll need to sign in
                    again to access your account.
                  </Dialog.Description>
                </Dialog.Header>
                <Dialog.Footer className="gap-5">
                  <Button
                    variant="tertiary"
                    onClick={() => setLogoutDialogOpen(false)}
                    label="Cancel"
                    disabled={isLoggingOut}
                  />
                  <Button
                    variant="primary"
                    onClick={handleLogout}
                    label={isLoggingOut ? "Logging out..." : "Yes, Logout"}
                    disabled={isLoggingOut}
                  />
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog>
          }
        />

        <AccountActionCard
          icon={TrashIcon}
          iconClassName="bg-secondary-red"
          title="Delete Account"
          description={
            isGuest
              ? "Guest accounts cannot be deleted"
              : "Permanently remove your account and data"
          }
          action={
            <ConfirmDeleteDialog
              title="Delete Account"
              description="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
              onDelete={handleDeleteAccount}
              isDeleting={isDeletingAccount}
            >
              <Button variant="destructive" label="Delete" disabled={isGuest} />
            </ConfirmDeleteDialog>
          }
        />
      </div>
    </Card>
  );
};
