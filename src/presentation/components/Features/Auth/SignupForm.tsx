"use client";

import { SignUpCredentialsDto, signUpCredentialsSchema } from "@/core/schemas";
import { GoogleIcon, InlineLink } from "@/presentation/components/Primitives";
import {
  Card,
  Form,
  InputField,
  LoadingButton,
} from "@/presentation/components/UI";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatabaseIcon, DetectiveIcon } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { OrContinueWith } from "./components/OrContinueWith";

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
      <h1 className="txt-preset-1">Sign up</h1>
      <p className="sr-only">Create an account to get started</p>
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
          <OrContinueWith />
          <div className="space-y-2">
            <LoadingButton
              type="button"
              variant="secondary"
              className="w-full"
              isLoading={false}
              icon={<GoogleIcon />}
              loadingLabel="Signing up with Google..."
            >
              Sign up with Google
            </LoadingButton>
            <LoadingButton
              type="button"
              variant="secondary"
              className="w-full"
              isLoading={false}
              icon={
                <DatabaseIcon
                  size={24}
                  weight="fill"
                  className="text-other-blue size-5"
                />
              }
              loadingLabel="Using local storage..."
            >
              Use local storage
            </LoadingButton>
            <LoadingButton
              type="button"
              variant="secondary"
              className="w-full"
              isLoading={false}
              icon={
                <DetectiveIcon
                  size={24}
                  weight="fill"
                  className="text-other-magenta size-5"
                />
              }
              loadingLabel="Continuing as guest..."
            >
              Continue as guest
            </LoadingButton>
          </div>
          <div className="txt-preset-4 text-grey-500 text-center">
            Already have an account?{" "}
            <InlineLink href="/login">Login</InlineLink>
          </div>
        </form>
      </Form>
    </Card>
  );
};
