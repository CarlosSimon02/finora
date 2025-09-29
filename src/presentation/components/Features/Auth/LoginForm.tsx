"use client";

import {
  LoginWithEmailCredentialsDto,
  loginWithEmailCredentialsSchema,
} from "@/core/schemas";
import {
  Button,
  Input,
  PasswordInput,
} from "@/presentation/components/Primitives";
import { Card, Form, LoadingButton } from "@/presentation/components/UI";
import { useGoogleSignIn, useLogin } from "@/presentation/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { AuthAltButtons } from ".";

export const LoginForm = () => {
  const form = useForm<LoginWithEmailCredentialsDto>({
    resolver: zodResolver(loginWithEmailCredentialsSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const login = useLogin();
  const google = useGoogleSignIn();

  const onSubmit = async (data: LoginWithEmailCredentialsDto) => {
    await login.mutateAsync(data);
  };

  const isLoading = login.isPending;
  const isSuccess = login.isSuccess;
  const isBusy = login.isPending || google.isPending;

  return (
    <Card className="w-full max-w-[35rem]">
      <h2 className="txt-preset-1">Login</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
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
              label="Password"
              inputComponent={({ field }) => <PasswordInput {...field} />}
              disabled={isBusy}
              helperText={
                <Link
                  href="/forgot-password"
                  className="text-preset-5 underline"
                >
                  Forgot password?
                </Link>
              }
            />
          </div>
          <LoadingButton
            type="submit"
            className="w-full"
            isLoading={isLoading}
            loadingLabel="Logging in..."
            disabled={isBusy || isSuccess}
            label="Login"
          />
          <AuthAltButtons
            disabled={isBusy || isSuccess}
            googleLoading={google.isPending}
            onGoogleClick={() => google.mutate()}
          />
          <div className="txt-preset-4 text-grey-500 text-center">
            Need to create an account?{" "}
            <Button href="/signup" label="Sign up" variant="link" />
          </div>
        </form>
      </Form>
    </Card>
  );
};
