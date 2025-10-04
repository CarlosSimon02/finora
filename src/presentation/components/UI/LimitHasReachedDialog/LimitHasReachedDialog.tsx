import { Button } from "@/presentation/components/Primitives";
import { Dialog } from "../Dialog/Dialog";

type LimitHasReachedDialogProps = {
  name: "Pots" | "Budgets" | "Incomes";
  children: React.ReactNode;
};

export const LimitHasReachedDialog = ({
  name,
  children,
}: LimitHasReachedDialogProps) => {
  return (
    <Dialog>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Limit Has Reached</Dialog.Title>
        <Dialog.Description>
          You have reached the limit for {name}. Please delete some items to add
          a new one.
        </Dialog.Description>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button label="Okay" />
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
