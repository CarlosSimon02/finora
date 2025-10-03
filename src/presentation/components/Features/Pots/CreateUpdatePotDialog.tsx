"use client";

import {
  CreatePotDto,
  createPotSchema,
  PotDto,
  UpdatePotDto,
} from "@/core/schemas/potSchema";
import { trpc } from "@/lib/trpc/client";
import { CurrencyInput, Input } from "@/presentation/components/Primitives";
import {
  ColorPickerReactSelect,
  Dialog,
  Form,
  LoadingButton,
} from "@/presentation/components/UI";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type CreateUpdatePotDialogProps = {
  children: ReactNode;
  title: string;
  operation: "create" | "update";
  initialData?: PotDto;
  onError?: (error: Error) => void;
};

export const CreateUpdatePotDialog = ({
  children,
  title,
  operation,
  initialData,
  onError,
}: CreateUpdatePotDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<CreatePotDto>({
    resolver: zodResolver(createPotSchema),
    defaultValues: {
      name: initialData?.name,
      colorTag: initialData?.colorTag,
      target: initialData?.target,
    },
  });

  const utils = trpc.useUtils();

  const handleError = (error: unknown) => {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Something went wrong";
    toast.error(message);
    if (onError) {
      onError(error as Error);
    }
  };

  const createPotMutation = trpc.createPot.useMutation({
    onSuccess: () => {
      toast.success("Pot created successfully!");
      setIsOpen(false);
      utils.getPaginatedPots.invalidate();
    },
    onError: (err) => handleError(err),
  });

  const updatePotMutation = trpc.updatePot.useMutation({
    onSuccess: () => {
      toast.success("Pot updated successfully!");
      setIsOpen(false);
      utils.getPaginatedPots.invalidate();
      if (initialData) {
        utils.getPot.invalidate({ potId: initialData.id });
      }
    },
    onError: (err) => handleError(err),
  });

  const isSubmitting =
    createPotMutation.isPending || updatePotMutation.isPending;

  const handleSubmit = async (data: CreatePotDto | UpdatePotDto) => {
    if (operation === "create") {
      await createPotMutation.mutateAsync({
        data: data as CreatePotDto,
      } as any);
      return;
    }
    if (operation === "update" && initialData) {
      await updatePotMutation.mutateAsync({
        potId: initialData.id,
        data: data as UpdatePotDto,
      } as any);
      return;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>
            {operation === "create"
              ? "Create a pot to set savings targets. These can help keep you on track as you save for special purchases."
              : "Update your pot details to better organize your savings goals. Pots are great for keeping your savings organized and for tracking your progress towards your goals."}
          </Dialog.Description>
        </Dialog.Header>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <Form.InputField
              control={form.control}
              name="name"
              label="Pot Name"
              disabled={isSubmitting}
              inputComponent={({ field }) => <Input {...field} />}
            />
            <Form.InputField
              control={form.control}
              name="target"
              label="Target Amount"
              disabled={isSubmitting}
              inputComponent={({ field }) => (
                <CurrencyInput
                  value={field.value ?? ""}
                  onValueChange={(values) =>
                    field.onChange(values.floatValue ?? null)
                  }
                  onBlur={field.onBlur}
                  thousandSeparator
                  allowNegative={false}
                  placeholder="0.00"
                  disabled={field.disabled}
                />
              )}
            />
            <Form.InputField
              control={form.control}
              name="colorTag"
              label="Color Theme"
              disabled={isSubmitting}
              inputComponent={({ field }) => (
                <ColorPickerReactSelect
                  defaultValue={field.value}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select color"
                  aria-invalid={!!form.formState.errors.colorTag}
                  disabled={field.disabled}
                />
              )}
            />
            <Dialog.Footer>
              <LoadingButton
                type="submit"
                isLoading={isSubmitting}
                loadingLabel={
                  operation === "create" ? "Creating..." : "Updating..."
                }
                disabled={isSubmitting}
                label={operation === "create" ? "Add Pot" : "Update Pot"}
              />
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};
