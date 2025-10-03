"use client";

import {
  BudgetDto,
  CreateBudgetDto,
  createBudgetSchema,
  UpdateBudgetDto,
} from "@/core/schemas/budgetSchema";
import { trpc } from "@/lib/trpc/client";
import { CurrencyInput, Input } from "@/presentation/components/Primitives";
import {
  ColorPickerReactSelect,
  Dialog,
  Form,
  LoadingButton,
} from "@/presentation/components/UI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type CreateUpdateBudgetDialogProps = {
  title: string;
  description?: string;
  operation: "create" | "update";
  initialData?: BudgetDto;
  onSuccess?: (data: BudgetDto) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
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
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = propsOpen !== undefined;
  const open = isControlled ? propsOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    propsOnOpenChange?.(newOpen);

    if (!newOpen) {
      onClose?.();
    }
  };

  const getDefaultValues = useCallback(
    () => ({
      name: initialData?.name ?? "",
      colorTag: initialData?.colorTag ?? "",
      maximumSpending: initialData?.maximumSpending ?? 0,
    }),
    [initialData]
  );

  const form = useForm<CreateBudgetDto>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: getDefaultValues(),
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
    onError?.(error as Error);
  };

  const createBudgetMutation = trpc.createBudget.useMutation({
    onSuccess: (data) => {
      toast.success("Budget created successfully!");
      form.reset(getDefaultValues());
      handleOpenChange(false);
      onSuccess?.(data as BudgetDto);
      utils.getPaginatedBudgets.invalidate();
      utils.getPaginatedBudgetsWithTransactions.invalidate();
      utils.getBudgetsSummary.invalidate();
    },
    onError: (err) => handleError(err),
    onSettled: () => onSettled?.(),
  });

  const updateBudgetMutation = trpc.updateBudget.useMutation({
    onSuccess: (data) => {
      toast.success("Budget updated successfully!");
      form.reset(getDefaultValues());
      handleOpenChange(false);
      onSuccess?.(data as BudgetDto);
      utils.getPaginatedBudgets.invalidate();
      utils.getPaginatedBudgetsWithTransactions.invalidate();
      utils.getBudgetsSummary.invalidate();
      if (initialData) {
        utils.getBudget.invalidate({ budgetId: initialData.id });
      }
    },
    onError: (err) => handleError(err),
    onSettled: () => onSettled?.(),
  });

  const isSubmitting =
    createBudgetMutation.isPending || updateBudgetMutation.isPending;

  const handleSubmit = async (data: CreateBudgetDto) => {
    if (operation === "create") {
      await createBudgetMutation.mutateAsync({ data } as any);
      return;
    }
    if (operation === "update" && initialData) {
      await updateBudgetMutation.mutateAsync({
        budgetId: initialData.id,
        data: data as UpdateBudgetDto,
      } as any);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content>
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
            onSubmit={form.handleSubmit(handleSubmit)}
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
                label={operation === "create" ? "Add Budget" : "Update Budget"}
              />
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};
