"use client";

import { ColorValue } from "@/constants/colors";
import {
  BudgetDto,
  CreateBudgetDto,
  createBudgetSchema,
  UpdateBudgetDto,
} from "@/core/schemas";
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
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type CreateUpdateBudgetDialogProps = {
  title: string;
  description?: string;
  operation: "create" | "update";
  initialData?: BudgetDto | Partial<CreateBudgetDto>;
  onSuccess?: (data: BudgetDto) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

export const CreateUpdateBudgetDialog = ({
  title,
  description,
  operation,
  initialData,
  onSuccess,
  onError,
  onSettled,
  onClose,
  open: propsOpen,
  onOpenChange: propsOnOpenChange,
  children,
}: CreateUpdateBudgetDialogProps) => {
  const getDefaultValues = useCallback(
    (): CreateBudgetDto => ({
      name: initialData?.name ?? "",
      colorTag: initialData?.colorTag ?? (undefined as unknown as ColorValue),
      maximumSpending:
        initialData?.maximumSpending ?? (undefined as unknown as number),
    }),
    [initialData]
  );

  const form = useForm<CreateBudgetDto>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: getDefaultValues(),
  });

  const utils = trpc.useUtils();

  const handleError = useErrorHandler({ onError });

  const createBudgetMutation = trpc.createBudget.useMutation({
    onSuccess: async (data) => {
      toast.success("Budget created successfully!");
      form.reset(getDefaultValues());
      handleOpenChange(false);
      onSuccess?.(data as BudgetDto);
      await utils.invalidate();
    },
    onError: handleError,
    onSettled,
  });

  const updateBudgetMutation = trpc.updateBudget.useMutation({
    onSuccess: async (data) => {
      toast.success("Budget updated successfully!");
      form.reset(getDefaultValues());
      handleOpenChange(false);
      onSuccess?.(data as BudgetDto);
      await utils.invalidate();
    },
    onError: handleError,
    onSettled,
  });

  const isSubmitting =
    createBudgetMutation.isPending || updateBudgetMutation.isPending;

  const { open, handleOpenChange } = useFormDialog({
    form,
    getDefaultValues,
    isSubmitting,
    propsOpen,
    propsOnOpenChange,
    onClose,
  });

  const { data: usedBudgetColors, isLoading: isLoadingUsedBudgetColors } =
    trpc.listUsedBudgetColors.useQuery(undefined, {
      enabled: open,
    });

  useUnsavedChangesGuard({
    isDirty: form.formState.isDirty,
    isSubmitting,
  });

  const hasBudgetChanges = (values: CreateBudgetDto): boolean => {
    if (operation !== "update" || !initialData) return true;

    return hasObjectChanges(
      values,
      initialData,
      ["name", "colorTag", "maximumSpending"],
      {
        name: normalizeString,
        maximumSpending: normalizeNumber,
      }
    );
  };

  const handleSubmit = async (
    data: CreateBudgetDto,
    e?: React.BaseSyntheticEvent
  ) => {
    // Prevent event from bubbling to parent forms
    e?.preventDefault();
    e?.stopPropagation();

    if (operation === "update" && initialData) {
      if (!("id" in initialData)) {
        toast.error("Cannot update budget: missing ID");
        return;
      }
      if (!form.formState.isDirty || !hasBudgetChanges(data)) {
        toast.info("No changes to update");
        return;
      }
      await updateBudgetMutation.mutateAsync({
        budgetId: initialData.id,
        data: data as UpdateBudgetDto,
      });
      return;
    }

    if (operation === "create") {
      await createBudgetMutation.mutateAsync({ data });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}
      <Dialog.Content
        onSubmit={(e: React.FormEvent) => {
          e.stopPropagation();
        }}
      >
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          {description && (
            <Dialog.Description>{description}</Dialog.Description>
          )}
          <Dialog.Description>
            Choose a category to set a spending budget. These categories can
            help you monitor spending.
          </Dialog.Description>
        </Dialog.Header>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit(handleSubmit)(e);
            }}
            onKeyDown={(e) => {
              // Prevent Enter key from bubbling to parent forms
              if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
                e.stopPropagation();
              }
            }}
            className="space-y-5"
          >
            <Form.InputField
              control={form.control}
              name="name"
              label="Budget Name"
              disabled={isSubmitting}
              inputComponent={({ field }) => <Input {...field} />}
            />
            <Form.InputField
              control={form.control}
              name="maximumSpending"
              label="Maximum Spending"
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
                  placeholder="0"
                  disabled={field.disabled}
                />
              )}
            />
            <Form.InputField
              control={form.control}
              name="colorTag"
              label="Color"
              disabled={isSubmitting}
              inputComponent={({ field }) => (
                <ColorPickerReactSelect
                  defaultValue={field.value}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select color"
                  isLoading={isLoadingUsedBudgetColors}
                  isOptionDisabled={(option) =>
                    usedBudgetColors?.includes(option.value) ?? false
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
                label={operation === "create" ? "Add Budget" : "Update Budget"}
              />
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};
