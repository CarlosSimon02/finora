import type { Meta, StoryObj } from "@storybook/nextjs";
import { FormProvider, useForm } from "react-hook-form";

import { Form } from "./Form";

const meta: Meta<typeof Form> = {
  title: "UI/Form",
  component: Form,
  decorators: [
    (Story) => {
      // Provide a fresh form for each story
      const methods = useForm({ defaultValues: { name: "" } });
      return (
        <FormProvider {...methods}>
          <div style={{ maxWidth: 480, margin: 24 }}>
            <Story />
          </div>
        </FormProvider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {
  render: (args) => {
    return (
      <Form.InputField
        name="name"
        label="Full name"
        placeholder="Enter your full name"
        helperText="We will never share your name"
        inputComponent={({ field, placeholder, disabled }) => (
          <input
            {...field}
            id={field.name}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full rounded-md border px-3 py-2"
          />
        )}
      />
    );
  },
};
