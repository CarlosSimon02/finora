import { SortOrder } from "@/core/schemas";
import { ReactSelect } from "@/presentation/components/Primitives";
import { GroupBase } from "react-select";
import { AsyncProps } from "react-select/async";

export const SORTYPE_OPTIONS: SortOption[] = [
  { label: "Latest", value: { field: "transactionDate", order: "desc" } },
  { label: "Oldest", value: { field: "transactionDate", order: "asc" } },
  { label: "A-Z", value: { field: "name", order: "asc" } },
  { label: "Z-A", value: { field: "name", order: "desc" } },
  { label: "Highest", value: { field: "signedAmount", order: "desc" } },
  { label: "Lowest", value: { field: "signedAmount", order: "asc" } },
];

export const DEFAULT_SORT_OPTION: SortOption = SORTYPE_OPTIONS[0];

type SortOption = {
  label: string;
  value: { field: string; order: SortOrder };
};

type SortSelectProps = Omit<
  AsyncProps<SortOption, false, GroupBase<SortOption>>,
  "onChange" | "value" | "defaultValue" | "isDisabled" | "loadOptions"
> & {
  value?: SortOption;
  defaultValue?: SortOption;
  onValueChange?: (value?: SortOption) => void;
  disabled?: boolean;
};

export const SortSelect = ({
  value,
  defaultValue,
  onValueChange,
  disabled,
  ...props
}: SortSelectProps) => {
  return (
    <ReactSelect<SortOption>
      defaultOptions={SORTYPE_OPTIONS}
      value={SORTYPE_OPTIONS.find((option) => option.value === value?.value)}
      defaultValue={SORTYPE_OPTIONS.find(
        (option) => option.value === defaultValue?.value
      )}
      onChange={(opt) => {
        onValueChange?.(opt as SortOption);
      }}
      isDisabled={disabled}
      {...props}
    />
  );
};
