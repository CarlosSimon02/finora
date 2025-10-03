import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import { Button } from "@/presentation/components/Primitives";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

const meta = {
  title: "UI/ConfirmDeleteDialog",
  component: ConfirmDeleteDialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ConfirmDeleteDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const SimulatedDelete = ({ delay = 800 }: { delay?: number }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const onDelete = async () => {
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, delay));
    setIsDeleting(false);
  };
  return (
    <ConfirmDeleteDialog
      title="Delete Item"
      description="Are you sure you want to delete this item? This action cannot be undone."
      onDelete={onDelete}
      isDeleting={isDeleting}
    >
      <Button label="Open confirm dialog" />
    </ConfirmDeleteDialog>
  );
};

export const Default: Story = {
  render: () => <SimulatedDelete />,
};

export const LongTexts: Story = {
  render: () => (
    <ConfirmDeleteDialog
      title={"Delete a very long, complex, and important record"}
      description={
        "This operation will permanently remove the record from the database. Please confirm that you wish to proceed. This action cannot be undone and may have downstream effects."
      }
      onDelete={async () => {}}
      isDeleting={false}
    >
      <Button label="Open with long text" />
    </ConfirmDeleteDialog>
  ),
};

export const ControlledOpen: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <ConfirmDeleteDialog
        title="Controlled Dialog"
        description="Opens initially via controlled prop."
        open={open}
        onOpenChange={setOpen}
        onDelete={async () => setOpen(false)}
        isDeleting={false}
      >
        <Button label="Open controlled" />
      </ConfirmDeleteDialog>
    );
  },
};

export const WhileDeleting: Story = {
  render: () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const onDelete = async () => {
      setIsDeleting(true);
      await new Promise((r) => setTimeout(r, 1500));
      setIsDeleting(false);
    };
    return (
      <ConfirmDeleteDialog
        title="Deleting State"
        description="Buttons reflect loading/disabled state."
        onDelete={onDelete}
        isDeleting={isDeleting}
      >
        <Button label="Open deleting example" />
      </ConfirmDeleteDialog>
    );
  },
};

export const NestedInCustomTrigger: Story = {
  render: () => (
    <ConfirmDeleteDialog
      title="Custom Trigger"
      description="Using a destructive variant button as trigger."
      onDelete={async () => {}}
      isDeleting={false}
    >
      <Button variant="destructive" label="Delete item" />
    </ConfirmDeleteDialog>
  ),
};
