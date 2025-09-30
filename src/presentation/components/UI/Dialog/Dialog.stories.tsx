import type { Meta, StoryObj } from "@storybook/nextjs";

import { Button } from "../../Primitives/Button/Button";
import { Dialog } from "./Dialog";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button label="Open Dialog" />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.Description>
            This is a simple dialog using the compound API.
          </Dialog.Description>
        </Dialog.Header>
        <div className="text-muted-foreground text-sm">
          Put any custom content here. It can be forms, paragraphs, lists, etc.
        </div>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="secondary" label="Cancel" />
          </Dialog.Close>
          <Button label="Confirm" />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};

export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button label="Open (no close icon)" />
      </Dialog.Trigger>
      <Dialog.Content showCloseButton={false}>
        <Dialog.Header>
          <Dialog.Title>No Close Icon</Dialog.Title>
          <Dialog.Description>
            The built-in close icon is hidden via showCloseButton.
          </Dialog.Description>
        </Dialog.Header>
        <div className="text-muted-foreground text-sm">
          Use footer actions or custom controls to close the dialog.
        </div>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="secondary" label="Close" />
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};

export const WithLongContent: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>
        <Button label="Open (long content)" />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Long Content</Dialog.Title>
          <Dialog.Description>
            Demonstrates scrolling within the dialog area.
          </Dialog.Description>
        </Dialog.Header>
        <div className="text-muted-foreground max-h-64 space-y-3 overflow-auto pr-1 text-sm">
          {Array.from({ length: 20 }).map((_, idx) => (
            <p key={idx}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam.
            </p>
          ))}
        </div>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="secondary" label="Close" />
          </Dialog.Close>
          <Button label="Action" />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
};
