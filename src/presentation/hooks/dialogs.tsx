import { useCallback, useEffect, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export type FormDialogOptions<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  getDefaultValues: () => TFormValues;
  isSubmitting: boolean;
  propsOpen?: boolean;
  propsOnOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  confirmMessage?: string;
};

export type FormDialogControls = {
  open: boolean;
  handleOpenChange: (newOpen: boolean) => void;
};

export const useFormDialog = <TFormValues extends FieldValues>({
  form,
  getDefaultValues,
  isSubmitting,
  propsOpen,
  propsOnOpenChange,
  onClose,
  confirmMessage = "Discard your unsaved changes?",
}: FormDialogOptions<TFormValues>): FormDialogControls => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = propsOpen !== undefined;
  const open = isControlled ? propsOpen : internalOpen;

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        if (form.formState.isDirty && !isSubmitting) {
          const confirmed = window.confirm(confirmMessage);
          if (!confirmed) return;
        }
        form.reset(getDefaultValues());
        onClose?.();
      } else {
        form.reset(getDefaultValues());
      }

      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      propsOnOpenChange?.(newOpen);
    },
    [
      form,
      getDefaultValues,
      isSubmitting,
      isControlled,
      propsOnOpenChange,
      onClose,
      confirmMessage,
    ]
  );

  // Reset form when dialog opens or when getDefaultValues changes (e.g., initialData updates)
  // This ensures the form always displays current data, especially for controlled dialogs
  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues());
    }
  }, [open, getDefaultValues, form]);

  return { open, handleOpenChange };
};

export type UnsavedChangesGuardOptions = {
  isDirty: boolean;
  isSubmitting: boolean;
};

export const useUnsavedChangesGuard = ({
  isDirty,
  isSubmitting,
}: UnsavedChangesGuardOptions) => {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty || isSubmitting) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty, isSubmitting]);
};
