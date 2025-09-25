"use client";

import { SignUpCredentialsDto, signUpCredentialsSchema } from "@/core/schemas";
import { InlineLink } from "@/presentation/components/Primitives";
import {
  Card,
  Form,
  InputField,
  LoadingButton,
} from "@/presentation/components/UI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthAltButtons } from ".";

export const SignupForm = () => {
  const form = useForm<SignUpCredentialsDto>({
    resolver: zodResolver(signUpCredentialsSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: SignUpCredentialsDto) => {
    console.log(data);
  };

  const isLoading = form.formState.isSubmitting;
  const isSuccess = false;

  return (
    <Card className="w-full max-w-[35rem]">
      <h2 className="txt-preset-1">Sign up</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <InputField
              control={form.control}
              name="name"
              label="Name"
              type="text"
            />
            <InputField
              control={form.control}
              name="email"
              label="Email Address"
              type="email"
            />
            <InputField
              control={form.control}
              name="password"
              label="Create Password"
              helperText="Passwords must be at least 8 characters"
              type="password"
            />
          </div>
          <LoadingButton
            type="submit"
            className="w-full"
            isLoading={false}
            loadingLabel="Creating account..."
            disabled={isSuccess}
          >
            Create Account
          </LoadingButton>
          <AuthAltButtons />
          <div className="txt-preset-4 text-grey-500 text-center">
            Already have an account?{" "}
            <InlineLink href="/login">Login</InlineLink>
          </div>
        </form>
      </Form>
    </Card>
  );
};
