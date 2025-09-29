import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "./Form";

const meta: Meta<typeof Form> = {
  title: "UI/Form",
  component: Form,
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {
  render: (args) => {
    const methods = useForm({
      resolver: zodResolver(
        z.object({
          name: z.string().min(1, "Hello world"),
        })
      ),
      defaultValues: {
        name: "",
      },
    });

    return (
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(() => {
            console.log("Submit");
          })}
        >
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
          <button type="submit">Submit</button>
        </form>
      </Form>
    );
  },
};
