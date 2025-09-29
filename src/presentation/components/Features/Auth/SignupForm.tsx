"use client";

import { SignUpCredentialsDto, signUpCredentialsSchema } from "@/core/schemas";
import {
  Button,
  Input,
  PasswordInput,
} from "@/presentation/components/Primitives";
import { Card, Form, LoadingButton } from "@/presentation/components/UI";
import { useGoogleSignIn, useSignUp } from "@/presentation/hooks";
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

  const signUp = useSignUp();
  const google = useGoogleSignIn();

  const onSubmit = async (data: SignUpCredentialsDto) => {
    await signUp.mutateAsync(data);
  };

  const isLoading = signUp.isPending;
  const isSuccess = signUp.isSuccess;
  const isBusy = signUp.isPending || google.isPending;

  return (
    <Card className="w-full max-w-[35rem]">
      <h2 className="txt-preset-1">Sign up</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Form.InputField
              control={form.control}
              name="name"
              label="Name"
              inputComponent={({ field }) => <Input {...field} type="text" />}
              disabled={isBusy}
            />
            <Form.InputField
              control={form.control}
              name="email"
              label="Email Address"
              inputComponent={({ field }) => <Input {...field} type="email" />}
              disabled={isBusy}
            />
            <Form.InputField
              control={form.control}
              name="password"
              label="Create Password"
              helperText="Passwords must be at least 8 characters"
              inputComponent={({ field }) => <PasswordInput {...field} />}
              disabled={isBusy}
            />
          </div>
          <LoadingButton
            type="submit"
            className="w-full"
            isLoading={isLoading}
            loadingLabel="Creating account..."
            disabled={isBusy || isSuccess}
            label="Create Account"
          />
          <AuthAltButtons
            disabled={isBusy || isSuccess}
            googleLoading={google.isPending}
            onGoogleClick={() => google.mutate()}
          />
          <div className="txt-preset-4 text-grey-500 text-center">
            Already have an account?{" "}
            <Button href="/login" label="Login" variant="link" />
          </div>
        </form>
      </Form>
    </Card>
  );
};
