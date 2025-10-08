"use client";

import { ColorValue } from "@/constants/colors";
import {
  CreateIncomeDto,
  createIncomeSchema,
  IncomeDto,
  UpdateIncomeDto,
} from "@/core/schemas/incomeSchema";
import { trpc } from "@/lib/trpc/client";
import { Input } from "@/presentation/components/Primitives";
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
import { hasObjectChanges, normalizeString } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type CreateUpdateIncomeDialogProps = {
  title: string;
  description?: string;
  operation: "create" | "update";
  initialData?: IncomeDto | Partial<CreateIncomeDto>;
  onSuccess?: (data: IncomeDto) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

export const CreateUpdateIncomeDialog = ({
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
}: CreateUpdateIncomeDialogProps) => {
  const getDefaultValues = useCallback(
    (): CreateIncomeDto => ({
      name: initialData?.name ?? "",
      colorTag: initialData?.colorTag ?? (undefined as unknown as ColorValue),
    }),
    [initialData]
  );

  const form = useForm<CreateIncomeDto>({
    resolver: zodResolver(createIncomeSchema),
    defaultValues: getDefaultValues(),
  });

  const utils = trpc.useUtils();

  const handleError = useErrorHandler({ onError });

  const createIncomeMutation = trpc.createIncome.useMutation({
    onSuccess: (data) => {
      toast.success("Income created successfully!");
      form.reset(getDefaultValues());
      handleOpenChange(false);
      onSuccess?.(data as IncomeDto);
      utils.invalidate();
    },
    onError: handleError,
    onSettled,
  });

  const updateIncomeMutation = trpc.updateIncome.useMutation({
    onSuccess: (data) => {
      toast.success("Income updated successfully!");
      form.reset(getDefaultValues());
      handleOpenChange(false);
      onSuccess?.(data as IncomeDto);
      utils.invalidate();
    },
    onError: handleError,
    onSettled,
  });

  const isSubmitting =
    createIncomeMutation.isPending || updateIncomeMutation.isPending;

  const { open, handleOpenChange } = useFormDialog({
    form,
    getDefaultValues,
    isSubmitting,
    propsOpen,
    propsOnOpenChange,
    onClose,
  });

  const { data: usedIncomeColors, isLoading: isLoadingUsedIncomeColors } =
    trpc.listUsedIncomeColors.useQuery(undefined, {
      enabled: open,
    });

  useUnsavedChangesGuard({
    isDirty: form.formState.isDirty,
    isSubmitting,
  });

  const hasIncomeChanges = (values: CreateIncomeDto): boolean => {
    if (operation !== "update" || !initialData) return true;

    return hasObjectChanges(values, initialData, ["name", "colorTag"], {
      name: normalizeString,
    });
  };

  const handleSubmit = async (
    data: CreateIncomeDto,
    e?: React.BaseSyntheticEvent
  ) => {
    // Prevent event from bubbling to parent forms
    e?.preventDefault();
    e?.stopPropagation();

    if (operation === "update" && initialData) {
      if (!("id" in initialData)) {
        toast.error("Cannot update income: missing ID");
        return;
      }
      if (!form.formState.isDirty || !hasIncomeChanges(data)) {
        toast.info("No changes to update");
        return;
      }
      await updateIncomeMutation.mutateAsync({
        incomeId: initialData.id,
        data: data as UpdateIncomeDto,
      });
      return;
    }

    if (operation === "create") {
      await createIncomeMutation.mutateAsync({ data });
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
            Create an income source to track your earnings.
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
              label="Income Name"
              disabled={isSubmitting}
              inputComponent={({ field }) => <Input {...field} />}
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
                  isLoading={isLoadingUsedIncomeColors}
                  isOptionDisabled={(option) =>
                    usedIncomeColors?.includes(option.value) ?? false
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
                label={operation === "create" ? "Add Income" : "Update Income"}
              />
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};
