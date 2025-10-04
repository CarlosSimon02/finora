"use client";

import { ColorValue } from "@/constants/colors";
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
import {
  useErrorHandler,
  useFormDialog,
  useUnsavedChangesGuard,
} from "@/presentation/hooks";
import { hasObjectChanges, normalizeNumber, normalizeString } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useCallback } from "react";
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
  const getDefaultValues = useCallback(
    (): CreatePotDto => ({
      name: initialData?.name ?? "",
      target: initialData?.target ?? (undefined as unknown as number),
      colorTag: initialData?.colorTag ?? (undefined as unknown as ColorValue),
    }),
    [initialData]
  );

  const form = useForm<CreatePotDto>({
    resolver: zodResolver(createPotSchema),
    defaultValues: getDefaultValues(),
  });

  const utils = trpc.useUtils();

  const handleError = useErrorHandler({ onError });

  const createPotMutation = trpc.createPot.useMutation({
    onSuccess: () => {
      toast.success("Pot created successfully!");
      form.reset(getDefaultValues());
      handleOpenChange(false);
      utils.getPaginatedPots.invalidate();
      utils.listUsedPotColors.invalidate();
      utils.getPotsCount.invalidate();
    },
    onError: handleError,
  });

  const updatePotMutation = trpc.updatePot.useMutation({
    onSuccess: () => {
      toast.success("Pot updated successfully!");
      form.reset(getDefaultValues());
      handleOpenChange(false);
      utils.getPaginatedPots.invalidate();
      if (initialData) {
        utils.getPot.invalidate({ potId: initialData.id });
      }
    },
    onError: handleError,
  });

  const isSubmitting =
    createPotMutation.isPending || updatePotMutation.isPending;

  const { open, handleOpenChange } = useFormDialog({
    form,
    getDefaultValues,
    isSubmitting,
  });

  const { data: usedPotColors, isLoading: isLoadingUsedPotColors } =
    trpc.listUsedPotColors.useQuery(undefined, {
      enabled: open,
    });

  useUnsavedChangesGuard({
    isDirty: form.formState.isDirty,
    isSubmitting,
  });

  const hasPotChanges = (values: CreatePotDto): boolean => {
    if (operation !== "update" || !initialData) return true;

    return hasObjectChanges(
      values,
      initialData,
      ["name", "colorTag", "target"],
      {
        name: normalizeString,
        target: normalizeNumber,
      }
    );
  };

  const handleSubmit = async (data: CreatePotDto) => {
    if (operation === "update" && initialData) {
      if (!form.formState.isDirty || !hasPotChanges(data)) {
        toast.info("No changes to update");
        return;
      }
      await updatePotMutation.mutateAsync({
        potId: initialData.id,
        data: data as UpdatePotDto,
      });
      return;
    }

    if (operation === "create") {
      await createPotMutation.mutateAsync({
        data: data as CreatePotDto,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
                  isLoading={isLoadingUsedPotColors}
                  isOptionDisabled={(option) =>
                    usedPotColors?.includes(option.value) ?? false
                  }
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
                disabled={
                  isSubmitting ||
                  (operation === "update" && !form.formState.isDirty)
                }
                label={operation === "create" ? "Add Pot" : "Update Pot"}
              />
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};
