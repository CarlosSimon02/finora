import { Button, Input } from "@/presentation/components/Primitives";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "./Form";

const meta: Meta<typeof Form> = {
  title: "UI/Form",
  component: Form,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {
  render: () => {
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
      <div className="flex h-screen items-center justify-center">
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(() => {
              console.log("Submit");
            })}
            className="w-full max-w-[35rem] space-y-4"
          >
            <Form.InputField
              name="name"
              label="Full name"
              helperText="We will never share your name"
              inputComponent={({ field }) => (
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Enter your full name"
                />
              )}
            />
            <Button label="Submit" type="submit" />
          </form>
        </Form>
      </div>
    );
  },
};
