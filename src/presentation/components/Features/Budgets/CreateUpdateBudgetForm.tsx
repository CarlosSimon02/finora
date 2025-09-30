"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/presentation/components/Primitives";
import {
  ColorPicker,
  Dialog,
  Form,
  LoadingButton,
} from "@/presentation/components/UI";

import {
  BudgetDto,
  CreateBudgetDto,
  createBudgetSchema,
} from "@/core/schemas/budgetSchema";

type BudgetFormProps = {
  onSubmit: (data: CreateBudgetDto) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  operation: "create" | "update";
  initialData?: BudgetDto;
};

export const CreateUpdateBudgetForm = ({
  onSubmit,
  onCancel,
  isSubmitting,
  operation,
  initialData,
}: BudgetFormProps) => {
  const form = useForm<CreateBudgetDto>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: {
      name: "",
      colorTag: "",
      maximumSpending: 0,
    },
  });

  const colorTag = form.watch("colorTag");

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Form.InputField
          control={form.control}
          name="name"
          label="Budget Name"
          inputComponent={({ field }) => <Input {...field} />}
        />
        <Form.InputField
          control={form.control}
          name="maximumSpending"
          label="Maximum Spending"
          inputComponent={({ field }) => (
            <Input {...field} type="number" step="0.01" placeholder="0.00" />
          )}
        />
        <Form.InputField
          control={form.control}
          name="colorTag"
          label="Color"
          inputComponent={({ field }) => (
            <ColorPicker
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Select color"
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
  );
};
