import { TransactionTypeDto } from "@/core/schemas";
import { ReactSelect } from "@/presentation/components/Primitives";
import { GroupBase } from "react-select";
import { AsyncProps } from "react-select/async";

type TransactionTypeOption = { label: string; value: TransactionTypeDto };

const TRANSACTION_TYPE_OPTIONS = [
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
] as const;

type TransactionSelectProps = Omit<
  AsyncProps<TransactionTypeOption, false, GroupBase<TransactionTypeOption>>,
  "onChange" | "value" | "defaultValue" | "isDisabled" | "loadOptions"
> & {
  value?: TransactionTypeDto;
  defaultValue?: TransactionTypeDto;
  onValueChange?: (value?: TransactionTypeDto) => void;
  disabled?: boolean;
};

export const TransactionTypeSelect = ({
  value,
  defaultValue,
  onValueChange,
  disabled,
  ...props
}: TransactionSelectProps) => {
  return (
    <ReactSelect<TransactionTypeOption>
      defaultOptions={TRANSACTION_TYPE_OPTIONS}
      value={TRANSACTION_TYPE_OPTIONS.find((option) => option.value === value)}
      defaultValue={TRANSACTION_TYPE_OPTIONS.find(
        (option) => option.value === defaultValue
      )}
      onChange={(opt) => {
        onValueChange?.(opt?.value);
      }}
      isDisabled={disabled}
      {...props}
    />
  );
};
