"use client";

import {
  CreateTransactionDto,
  createTransactionSchema,
  TransactionDto,
  UpdateTransactionDto,
} from "@/core/schemas";
import { trpc } from "@/lib/trpc/client";
import { CurrencyInput, Input } from "@/presentation/components/Primitives";
import {
  Dialog,
  EmojiPicker,
  Form,
  LoadingButton,
} from "@/presentation/components/UI";
import {
  useErrorHandler,
  useFormDialog,
  useUnsavedChangesGuard,
} from "@/presentation/hooks";
import { hasObjectChanges, normalizeString, toInputDateString } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CategoryOptionType, CategorySelect } from "./CategorySelect";
import { TransactionTypeSelect } from "./TransactionTypeSelect";

type CreateUpdateTransactionDialogProps = {
  title: string;
  description?: string;
  operation: "create" | "update";
  initialData?: TransactionDto;
  onSuccess?: (data: TransactionDto) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

export const CreateUpdateTransactionDialog = ({
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
}: CreateUpdateTransactionDialogProps) => {
  const [category, setCategory] = useState<CategoryOptionType | null>(
    initialData?.category
      ? {
          value: initialData?.category.id,
          label: initialData?.category.name,
          colorTag: initialData?.category.colorTag,
        }
      : null
  );

  const getDefaultValues = useCallback(
    (): CreateTransactionDto => ({
      name: initialData?.name ?? "",
      type: initialData?.type ?? "expense",
      amount: initialData?.amount ?? ("" as unknown as number),
      transactionDate: initialData?.transactionDate ?? new Date(),
      emoji: initialData?.emoji ?? "📃",
      categoryId: initialData?.category?.id ?? "",
    }),
    [initialData]
  );

  const form = useForm<CreateTransactionDto>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: getDefaultValues(),
  });

  const transactionType = form.watch("type");

  useEffect(() => {
    // Only clear if transactionType changes after initial render
    if (form.formState.isDirty) {
      setCategory(null);
      form.setValue("categoryId", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [transactionType, form]);

  useEffect(() => {
    const newCategoryId = category?.value || "";
    const previousCategoryId = form.getValues("categoryId");
    const shouldDirty = previousCategoryId !== newCategoryId;
    form.setValue("categoryId", newCategoryId, {
      shouldDirty,
      shouldValidate: shouldDirty,
    });
  }, [category, form]);

  const utils = trpc.useUtils();

  const handleError = useErrorHandler({ onError });

  const createTransactionMutation = trpc.createTransaction.useMutation({
    onSuccess: (data) => {
      toast.success("Transaction created successfully!");
      form.reset(getDefaultValues());
      handleOpenChange(false);
      onSuccess?.(data);
      utils.invalidate();
    },
    onError: handleError,
    onSettled,
  });

  const updateTransactionMutation = trpc.updateTransaction.useMutation({
    onSuccess: (data) => {
      toast.success("Transaction updated successfully!");
      form.reset(getDefaultValues());
      handleOpenChange(false);
      onSuccess?.(data);
      utils.invalidate();
    },
    onError: handleError,
    onSettled,
  });

  const isSubmitting =
    createTransactionMutation.isPending || updateTransactionMutation.isPending;

  const { open, handleOpenChange } = useFormDialog({
    form,
    getDefaultValues,
    isSubmitting,
    propsOpen,
    propsOnOpenChange,
    onClose,
  });

  // Reset category state when dialog opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      // When dialog opens, reset to initialData category or null
      if (initialData?.category) {
        setCategory({
          value: initialData.category.id,
          label: initialData.category.name,
          colorTag: initialData.category.colorTag,
        });
      } else {
        setCategory(null);
      }
    }
  }, [open, initialData]);

  useUnsavedChangesGuard({
    isDirty: form.formState.isDirty,
    isSubmitting,
  });

  const hasTransactionChanges = (values: CreateTransactionDto): boolean => {
    if (operation !== "update" || !initialData) return true;

    const { category, ...rest } = initialData;

    return hasObjectChanges(
      values,
      { ...rest, categoryId: category.id },
      ["name", "categoryId"],
      {
        name: normalizeString,
      }
    );
  };

  const handleSubmit = async (data: CreateTransactionDto) => {
    if (operation === "update" && initialData) {
      if (!form.formState.isDirty || !hasTransactionChanges(data)) {
        toast.info("No changes to update");
        return;
      }
      await updateTransactionMutation.mutateAsync({
        transactionId: initialData.id,
        data: data as UpdateTransactionDto,
      });
      return;
    }

    if (operation === "create") {
      await createTransactionMutation.mutateAsync({ data });
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
            Create a transaction to track your spending.
          </Dialog.Description>
        </Dialog.Header>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <div className="grid w-full grid-cols-2 items-start gap-2">
              <Form.InputField
                control={form.control}
                name="type"
                label="Transaction Type"
                disabled={isSubmitting}
                inputComponent={({ field }) => (
                  <TransactionTypeSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={field.disabled}
                    defaultValue={field.value}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                )}
              />
              <Form.InputField
                control={form.control}
                name="amount"
                label="Amount"
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
            </div>

            <div className="grid w-full grid-cols-[1fr_30%] items-start gap-2">
              <Form.InputField
                control={form.control}
                name="name"
                label="Transaction Name"
                disabled={isSubmitting}
                inputComponent={({ field }) => <Input {...field} />}
              />
              <Form.InputField
                control={form.control}
                name="emoji"
                label="Emoji"
                disabled={isSubmitting}
                inputComponent={({ field }) => <EmojiPicker {...field} />}
              />
            </div>

            <Form.InputField
              control={form.control}
              name="categoryId"
              label="Category"
              disabled={isSubmitting}
              inputComponent={({ field }) => (
                <CategorySelect
                  value={category}
                  onChange={(value) => {
                    setCategory(value);
                  }}
                  transactionType={transactionType}
                  disabled={isSubmitting}
                  selectRef={field.ref}
                />
              )}
            />

            <Form.InputField
              control={form.control}
              name="transactionDate"
              label="Transaction Date"
              disabled={isSubmitting}
              inputComponent={({ field }) => {
                return (
                  <Input
                    type="date"
                    onBlur={field.onBlur}
                    name={field.name}
                    disabled={field.disabled}
                    placeholder="Select transaction date"
                    value={toInputDateString(field.value)}
                    onChange={(e) => {
                      field.onChange(new Date(e.target.value));
                    }}
                  />
                );
              }}
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
                label={
                  operation === "create"
                    ? "Add Transaction"
                    : "Update Transaction"
                }
              />
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};
