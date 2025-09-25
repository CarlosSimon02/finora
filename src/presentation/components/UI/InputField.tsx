import { Input, PasswordInput } from "@/presentation/components/Primitives";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./Form";

type InputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = UseControllerProps<TFieldValues, TName> & {
  type: "text" | "email" | "password";
  placeholder?: string;
  label: string;
  helperText?: string | React.ReactNode;
};

export const InputField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  type,
  label,
  placeholder,
  helperText,
  ...props
}: InputFieldProps<TFieldValues, TName>) => {
  const InputComponent = type === "password" ? PasswordInput : Input;

  return (
    <FormField
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <InputComponent
              {...field}
              placeholder={placeholder}
              disabled={props.disabled}
            />
          </FormControl>
          {fieldState.error ? (
            <FormMessage />
          ) : helperText ? (
            <p className="txt-preset-5 text-grey-500 w-full text-right">
              {helperText}
            </p>
          ) : null}
        </FormItem>
      )}
      {...props}
    />
  );
};
