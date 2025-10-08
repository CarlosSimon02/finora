import { SortOrder } from "@/core/schemas";
import { Select } from "@/presentation/components/UI/Select/Select";
import { SortAscendingIcon } from "@phosphor-icons/react";

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

type SortSelectProps = {
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
}: SortSelectProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="txt-preset-4 text-grey-500 hidden shrink-0 @4xl:inline">
        Sort by
      </span>
      <Select
        value={SORTYPE_OPTIONS.find((o) => o.value === value?.value)?.label}
        onValueChange={(label) =>
          onValueChange?.(SORTYPE_OPTIONS.find((o) => o.label === label))
        }
        disabled={disabled}
      >
        <Select.Trigger className="w-[3.125rem] @max-4xl:size-[3.125rem] @max-4xl:items-center @max-4xl:justify-center @max-4xl:!p-0 @4xl:w-[10rem] [&>svg:last-child]:hidden @4xl:[&>svg:last-child]:inline">
          <span className="@4xl:hidden">
            <SortAscendingIcon size={20} className="size-4" weight="fill" />
          </span>
          <div className="hidden @4xl:inline">
            <Select.Value placeholder="Latest" />
          </div>
        </Select.Trigger>
        <Select.Content>
          {SORTYPE_OPTIONS.map((opt) => (
            <Select.Item key={opt.label} value={opt.label}>
              {opt.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  );
};
